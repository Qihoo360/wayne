package webhook

import (
	"bytes"
	"crypto/sha1"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/astaxie/beego"

	"github.com/Qihoo360/wayne/src/backend/bus/message"
	"github.com/Qihoo360/wayne/src/backend/bus/newbus"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

const EventName = "webhook"

var (
	httpClient *http.Client
)

// init HTTPClient
func init() {
	httpClient = createHTTPClient()
}

const (
	MaxIdleConns        int = 100
	MaxIdleConnsPerHost int = 100
	IdleConnTimeout     int = 60
)

// createHTTPClient for connection re-use
func createHTTPClient() *http.Client {
	sec, err := beego.AppConfig.Int("WebhookClientTimeout")
	if err != nil || sec == 0 {
		sec = 10
	}
	client := &http.Client{
		Transport: &http.Transport{
			Proxy: http.ProxyFromEnvironment,
			DialContext: (&net.Dialer{
				Timeout:   30 * time.Second,
				KeepAlive: 30 * time.Second,
			}).DialContext,
			MaxIdleConns:        MaxIdleConns,
			MaxIdleConnsPerHost: MaxIdleConnsPerHost,
			IdleConnTimeout:     time.Duration(IdleConnTimeout) * time.Second,
		},
		Timeout: time.Duration(sec) * time.Second,
	}
	return client
}

func RegisterHookHandler() error {
	if newbus.UBus != nil {
		if err := newbus.UBus.RegisterHandler(EventName, Process); err != nil {
			logs.Error("register failed: %s ", err)
			return err
		}
		return nil
	}
	logs.Error("EventBus 未初始化")
	return errors.New("EventBus 未初始化")
}

func Process(msg *message.Message) error {
	var data *message.HookMessageData
	switch msg.Type {
	case message.TypeHook:
		if err := json.Unmarshal(msg.Data, &data); err != nil {
			logs.Error(err)
			return err
		}
		logs.Info(data)
	default:
		return nil // 不处理其他类型数据
	}
	webHooks, err := models.WebHookModel.GetTriggered(data.NamespaceId, data.AppId, data.EventKey)
	if err != nil {
		return err
	}

	for _, hook := range webHooks {
		go exec(hook, data)
	}
	return nil
}

func exec(hook models.WebHook, data *message.HookMessageData) {
	request := Request{
		EventKey: data.EventKey,
		User:     data.User,
		IP:       data.IP,
		Datetime: data.Datetime,
		Payload:  data.Payload,
	}

	if data.NamespaceId != 0 {
		ns, err := models.NamespaceModel.GetById(data.NamespaceId)
		if err != nil {
			logs.Error(err)
		} else {
			request.Namespace = response.Namespace{
				Id:         ns.Id,
				Name:       ns.Name,
				CreateTime: ns.CreateTime,
				UpdateTime: ns.UpdateTime,
				User:       ns.User,
			}
		}
	}

	if data.AppId != 0 {
		app, err := models.AppModel.GetById(data.AppId)
		if err != nil {
			logs.Error(err)
		} else {
			request.App = response.App{
				Id:          app.Id,
				Name:        app.Name,
				Description: app.Description,
				User:        app.User,
				CreateTime:  app.CreateTime,
				UpdateTime:  app.UpdateTime,
			}
		}
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		logs.Error(err)
		return
	}
	body := bytes.NewReader(jsonData)

	req, err := http.NewRequest(http.MethodPost, hook.Url, body)
	if err != nil {
		logs.Error(err)
		return
	}
	ua, _ := os.Hostname()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", fmt.Sprintf("Wayne-WebHook/%s", ua))
	if len(hook.Secret) > 0 {
		req.Header.Set("X-Wayne-Signature", fmt.Sprintf("sha1=%x", sha1.New().Sum([]byte(hook.Secret))))
	}

	var resp *http.Response
	resp, err = httpClient.Do(req)
	if err != nil {
		logs.Error(err)
		return
	}
	if resp.StatusCode >= http.StatusBadRequest {
		logs.Warning("WebHook failed to call %s with code %d", hook.Url, resp.StatusCode)
	}
	defer resp.Body.Close()
}
