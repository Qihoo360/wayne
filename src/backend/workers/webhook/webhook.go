package webhook

import (
	"bytes"
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/astaxie/beego"

	"github.com/Qihoo360/wayne/src/backend/bus"
	"github.com/Qihoo360/wayne/src/backend/bus/message"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/workers"
)

const QueueWebhook = "webhook"

type ClientPool struct {
	Window chan struct{}
	Client *http.Client
}

type WebhookWorker struct {
	*workers.BaseMessageWorker
	ClientPool *ClientPool
}

var _ workers.Worker = &WebhookWorker{}

func NewWebhookWorker(b *bus.Bus) (*WebhookWorker, error) {
	baseWorker := workers.NewBaseMessageWorker(b, QueueWebhook)
	sec, err := beego.AppConfig.Int("WebhookClientTimeout")
	if err != nil || sec == 0 {
		sec = 10
	}
	ws, err := beego.AppConfig.Int("WebhookClientWindowSize")
	if err != nil || ws == 0 {
		ws = 16
	}

	p := ClientPool{Window: make(chan struct{}, ws), Client: &http.Client{Timeout: time.Duration(sec) * time.Second}}

	w := &WebhookWorker{baseWorker, &p}
	w.BaseMessageWorker.MessageWorker = w

	if _, err := w.Bus.Channel.QueueDeclare(QueueWebhook, true, false, false, false, nil); err != nil {
		return nil, err
	}
	if err := w.Bus.Channel.QueueBind(QueueWebhook, bus.RoutingKeyRequest, w.Bus.Name, false, nil); err != nil {
		return nil, err
	}
	w.Bus.Channel.Qos(1, 0, true)

	return w, nil
}

func (w *WebhookWorker) Process(msg *message.Message) error {
	var data *message.HookMessageData
	switch msg.Type {
	case message.TypeHook:
		if err := json.Unmarshal(msg.Data, &data); err != nil {
			return err
		}
	default:
		return nil // 不处理其他类型数据
	}

	webHooks, err := models.WebHookModel.GetTriggered(data.NamespaceId, data.AppId, data.EventKey)
	if err != nil {
		return err
	}

	for _, hook := range webHooks {
		w.ClientPool.Window <- struct{}{}
		go w.exec(hook, data)
	}
	return nil
}

func (w *WebhookWorker) exec(hook models.WebHook, data *message.HookMessageData) {
	defer func() {
		<-w.ClientPool.Window
	}()
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
	resp, err = w.ClientPool.Client.Do(req)
	if err != nil {
		logs.Error(err)
		return
	}
	if resp.StatusCode >= http.StatusBadRequest {
		logs.Warning("WebHook failed to call %s with code %d", hook.Url, resp.StatusCode)
	}
}
