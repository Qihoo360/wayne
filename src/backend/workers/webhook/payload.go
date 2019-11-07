package webhook

import (
	"encoding/json"
	"time"

	"github.com/astaxie/beego"

	"github.com/Qihoo360/wayne/src/backend/bus/message"
	"github.com/Qihoo360/wayne/src/backend/bus/newbus"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/hookevent"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type Request struct {
	EventKey  string             `json:"event"`
	Namespace response.Namespace `json:"namespace"`
	App       response.App       `json:"app"`
	User      string             `json:"user"`
	IP        string             `json:"ip"`
	Datetime  time.Time          `json:"datetime"`
	Payload   interface{}        `json:"payload"`
}

type EventDeploymentPayload struct {
	Action     Action            `json:"action"`
	Deployment response.Resource `json:"deployment"`
}

type EventServicePayload struct {
	Action  Action            `json:"action"`
	Service response.Resource `json:"service"`
}

type EventIngressPayload struct {
	Action  Action            `json:"action"`
	Ingress response.Resource `json:"ingress"`
}

type EventMemberPayload struct {
	Action Action        `json:"action"`
	Member response.User `json:"member"`
}

type Action string

const (
	AddMember         Action = "AddMember"
	DeleteMember      Action = "DeleteMember"
	UpdateMember      Action = "UpdateMember"
	UpgradeDeployment Action = "UpgradeDeployment"
	DeleteDeployment  Action = "OfflineDeployment"
	OnlineService     Action = "OnlineService"
	OfflineService    Action = "OfflineService"
	OnlineIngress     Action = "OnlineIngress"
	OfflineIngress    Action = "OfflineIngress"
)

func PublishEventDeployment(namespaceId int64, appId int64, user string, ip string, action Action, deployment response.Resource) {
	if !enable() {
		return
	}
	messageData, err := json.Marshal(message.HookMessageData{
		NamespaceId: namespaceId,
		AppId:       appId,
		User:        user,
		IP:          ip,
		Datetime:    time.Now(),
		EventKey:    hookevent.EventDeployment.Key,
		Payload: EventDeploymentPayload{
			Action:     action,
			Deployment: deployment,
		},
	})
	if err != nil {
		logs.Error(err)
	} else {
		msg := message.Message{
			Type: message.TypeHook,
			Data: json.RawMessage(messageData),
		}
		// if err := bus.Notify(msg); err != nil {
		// 	logs.Error(err)
		// }
		if newbus.UBus != nil {
			if err := newbus.UBus.Publish(EventName, msg); err != nil {
				logs.Error(err)
			}
		}
	}
}

func PublishEventService(namespaceId int64, appId int64, user string, ip string, action Action, service response.Resource) {
	if !enable() {
		return
	}
	messageData, err := json.Marshal(message.HookMessageData{
		NamespaceId: namespaceId,
		AppId:       appId,
		User:        user,
		IP:          ip,
		Datetime:    time.Now(),
		EventKey:    hookevent.EventService.Key,
		Payload: EventServicePayload{
			Action:  action,
			Service: service,
		},
	})
	if err != nil {
		logs.Error(err)
	} else {
		msg := message.Message{
			Type: message.TypeHook,
			Data: json.RawMessage(messageData),
		}
		// if err := bus.Notify(msg); err != nil {
		// 	logs.Error(err)
		// }
		if newbus.UBus != nil {
			if err := newbus.UBus.Publish(EventName, msg); err != nil {
				logs.Error(err)
			}
		}
	}
}

func PublishEventIngress(namespaceId int64, appId int64, user string, ip string, action Action, ingress response.Resource) {
	if !enable() {
		return
	}
	messageData, err := json.Marshal(message.HookMessageData{
		NamespaceId: namespaceId,
		AppId:       appId,
		User:        user,
		IP:          ip,
		Datetime:    time.Now(),
		EventKey:    hookevent.EventIngress.Key,
		Payload: EventIngressPayload{
			Action:  action,
			Ingress: ingress,
		},
	})
	if err != nil {
		logs.Error(err)
	} else {
		msg := message.Message{
			Type: message.TypeHook,
			Data: json.RawMessage(messageData),
		}
		// if err := bus.Notify(msg); err != nil {
		// 	logs.Error(err)
		// }
		if newbus.UBus != nil {
			if err := newbus.UBus.Publish(EventName, msg); err != nil {
				logs.Error(err)
			}
		}
	}
}

func PublishEventMember(namespaceId int64, appId int64, user string, ip string, action Action, member models.User) {
	if !enable() {
		return
	}
	m := response.User{}
	m.LoadFromModel(member)
	messageData, err := json.Marshal(message.HookMessageData{
		NamespaceId: namespaceId,
		AppId:       appId,
		User:        user,
		IP:          ip,
		Datetime:    time.Now(),
		EventKey:    hookevent.EventMember.Key,
		Payload: EventMemberPayload{
			Action: action,
			Member: m,
		},
	})
	if err != nil {
		logs.Error(err)
	} else {
		msg := message.Message{
			Type: message.TypeHook,
			Data: json.RawMessage(messageData),
		}
		// if err := bus.Notify(msg); err != nil {
		// 	logs.Error(err)
		// }
		if newbus.UBus != nil {
			if err := newbus.UBus.Publish(EventName, msg); err != nil {
				logs.Error(err)
			}
		}
	}
}

func enable() bool {
	enable := beego.AppConfig.DefaultBool("EnableWebhook", false)
	if !enable {
		logs.Debug("EnableWebhook is not true!")
		return false
	}
	return true
}
