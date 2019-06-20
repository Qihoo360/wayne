package pod

import (
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/astaxie/beego"
	"github.com/360yun/sockjs-go/sockjs"
	"k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/remotecommand"
)

type PtyHandler interface {
	io.Reader
	io.Writer
	remotecommand.TerminalSizeQueue
}

type TerminalSession struct {
	id            string
	sockJSSession sockjs.Session
	sizeChan      chan remotecommand.TerminalSize
}

type TerminalMessage struct {
	Op, Data, SessionID string
	Rows, Cols          uint16
}

type TerminalResult struct {
	SessionId string `json:"sessionId,omitempty"`
	Token     string `json:"token,omitempty"`
	Cluster   string `json:"cluster,omitempty"`
	Namespace string `json:"namespace,omitempty"`
	Pod       string `json:"pod,omitempty"`
	Container string `json:"container,omitempty"`
	Cmd       string `json:"cmd,omitempty"`
}

func (t TerminalSession) Next() *remotecommand.TerminalSize {
	select {
	case size := <-t.sizeChan:
		return &size
	}
}

func (t TerminalSession) Read(p []byte) (int, error) {
	m, err := t.sockJSSession.Recv()
	if err != nil {
		return 0, err
	}

	var msg TerminalMessage
	if err := json.Unmarshal([]byte(m), &msg); err != nil {
		logs.Warning("read msg (%s) form client error.%v", string(p), err)
		return 0, err
	}
	switch msg.Op {
	case "stdin":
		return copy(p, msg.Data), nil
	case "resize":
		t.sizeChan <- remotecommand.TerminalSize{msg.Cols, msg.Rows}
		return 0, nil
	default:
		return 0, fmt.Errorf("unknown message type '%s'", msg.Op)
	}
}

func (t TerminalSession) Write(p []byte) (int, error) {
	msg, err := json.Marshal(TerminalMessage{
		Op:   "stdout",
		Data: string(p),
	})
	if err != nil {
		return 0, err
	}

	if err = t.sockJSSession.Send(string(msg)); err != nil {
		return 0, err
	}
	return len(p), nil
}

func (t TerminalSession) Close(status uint32, reason string) {
	t.sockJSSession.Close(status, reason)

	logs.Info("close socket (%s). %d, %s ", t.id, status, reason)

}

// 处理客户端发来的ws建立请求
func handleTerminalSession(session sockjs.Session) {
	var (
		buf string
		err error
		msg TerminalMessage
	)

	if buf, err = session.Recv(); err != nil {
		logs.Error("handleTerminalSession: can't Recv: %v", err)
		return
	}

	if err = json.Unmarshal([]byte(buf), &msg); err != nil {
		logs.Error("handleTerminalSession: can't UnMarshal (%v): %s", err, buf)
		return
	}

	if msg.Op != "bind" {
		logs.Error("handleTerminalSession: expected 'bind' message, got: %s", buf)
		return
	}

	var tr TerminalResult

	if err := json.Unmarshal(hack.Slice(msg.Data), &tr); err != nil {
		logs.Error("handleTerminalResult: can't UnMarshal (%v): %s", err, buf)
		return
	}

	err = checkShellToken(tr.Token, tr.Namespace, tr.Pod)
	if err != nil {
		logs.Error(http.StatusBadRequest, fmt.Sprintf("token (%s) not valid %v.", tr.Token, err))
		return
	}
	manager, err := client.Manager(tr.Cluster)
	if err == nil {
		ts := TerminalSession{
			id:            tr.SessionId,
			sockJSSession: session,
			sizeChan:      make(chan remotecommand.TerminalSize),
		}
		go WaitForTerminal(manager.Client, manager.Config, ts, tr.Namespace, tr.Pod, tr.Container, "")
		return
	} else {
		logs.Error(http.StatusBadRequest, fmt.Sprintf("%s %v", tr.Cluster, err))
		return
	}

}

func CreateAttachHandler(path string) http.Handler {
	return sockjs.NewHandler(path, sockjs.DefaultOptions, handleTerminalSession)
}

// @Title Create terminal
// @Param	cmd		query 	string	true		"the cmd you want to exec."
// @Param	container		query 	string	true		"the container name."
// @Description create container terminal
// @router /:pod/terminal/namespaces/:namespace/clusters/:cluster [post]
func (c *KubePodController) Terminal() {
	cluster := c.Ctx.Input.Param(":cluster")
	pod := c.Ctx.Input.Param(":pod")
	container := c.Input().Get("container")
	namespace := c.Ctx.Input.Param(":namespace")
	cmd := c.Input().Get("cmd")
	if pod == "" || container == "" {
		c.AbortBadRequest("Pod and container are required!")
	}

	sessionId, err := genTerminalSessionId()
	if err != nil {
		c.HandleError(err)
		return
	}

	c.Success(TerminalResult{
		SessionId: sessionId,
		Token:     generateToken(namespace, pod),
		Cluster:   cluster,
		Namespace: namespace,
		Pod:       pod,
		Container: container,
		Cmd:       cmd,
	})

}

// token生成规则
// 1. 拼接namespace、podName、unixtime(加600秒，十分钟期限)，平台appkey，并进行md5加密操作
// 2. 取生成的32位加密字符串第12-20位，于unixtime进行拼接生成token
func generateToken(namespace string, pod string) string {
	appKey := beego.AppConfig.String("appKey")
	endTime := time.Now().Unix() + 60*10
	rawTokenKey := namespace + pod + strconv.FormatInt(endTime, 10) + appKey
	md5Hash := md5.New()
	md5Hash.Write([]byte(rawTokenKey))
	cipher := md5Hash.Sum(nil)
	cipherStr := hex.EncodeToString(cipher)
	return cipherStr[12:20] + strconv.FormatInt(endTime, 10)
}

func checkShellToken(token string, namespace string, podName string) error {
	endTimeRaw := []rune(token)
	var endTime int64
	var endTimeStr string
	var err error

	if len(endTimeRaw) > 8 {
		endTimeStr = string(endTimeRaw[8:])
		endTime, err = strconv.ParseInt(endTimeStr, 10, 64)
		if err != nil {
			return err
		}
	}
	ntime := time.Now().Unix()

	if ntime > endTime {
		return errors.New("token time expired")
	}

	rawToken := namespace + podName + endTimeStr + beego.AppConfig.String("appKey")

	md5Ctx := md5.New()
	md5Ctx.Write([]byte(rawToken))
	cipherToken := hex.EncodeToString(md5Ctx.Sum(nil))

	checkToken := string([]rune(cipherToken)[12:20]) + endTimeStr
	if checkToken != token {
		return errors.New("token not match")
	}
	return nil
}

// 开始建立ws连接
func startProcess(k8sClient *kubernetes.Clientset, cfg *rest.Config, cmd []string, ptyHandler PtyHandler, namespace, pod, container string) error {
	req := k8sClient.CoreV1().RESTClient().Post().
		Resource("pods").
		Name(pod).
		Namespace(namespace).
		SubResource("exec")

	req.VersionedParams(&v1.PodExecOptions{
		Container: container,
		Command:   cmd,
		Stdin:     true,
		Stdout:    true,
		Stderr:    true,
		TTY:       true,
	}, scheme.ParameterCodec)

	exec, err := remotecommand.NewSPDYExecutor(cfg, "POST", req.URL())
	if err != nil {
		return err
	}

	err = exec.Stream(remotecommand.StreamOptions{
		Stdin:             ptyHandler,
		Stdout:            ptyHandler,
		Stderr:            ptyHandler,
		TerminalSizeQueue: ptyHandler,
		Tty:               true,
	})
	if err != nil {
		return err
	}

	return nil
}

func genTerminalSessionId() (string, error) {
	bytes := make([]byte, 16)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	id := make([]byte, hex.EncodedLen(len(bytes)))
	hex.Encode(id, bytes)
	return string(id), nil
}

func isValidShell(validShells []string, shell string) bool {
	for _, validShell := range validShells {
		if validShell == shell {
			return true
		}
	}
	return false
}

func WaitForTerminal(k8sClient *kubernetes.Clientset, cfg *rest.Config, ts TerminalSession, namespace, pod, container, cmd string) {
	var err error
	validShells := []string{"bash", "sh"}

	if isValidShell(validShells, cmd) {
		cmds := []string{cmd}
		err = startProcess(k8sClient, cfg, cmds, ts, namespace, pod, container)
	} else {
		for _, testShell := range validShells {
			cmd := []string{testShell}
			if err = startProcess(k8sClient, cfg, cmd, ts, namespace, pod, container); err == nil {
				break
			}
		}
	}

	if err != nil {
		ts.Close(2, err.Error())
		return
	}

	ts.Close(1, "Process exited")
}
