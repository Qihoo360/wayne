package message

import (
	"encoding/json"
	"time"
)

type Type string

const (
	TypeRequest Type = "request"
	TypeHook    Type = "hook"
	TypeTask    Type = "task"
)

type Message struct {
	Type Type
	Data json.RawMessage
}

type RequestMessageData struct {
	URI        string
	Controller string
	Method     string

	User string
	IP   string

	ResponseStatus int
	ResponseBody   []byte
}

type HookMessageData struct {
	NamespaceId int64
	AppId       int64

	User     string
	IP       string
	Datetime time.Time

	EventKey string
	Payload  interface{}
}

type TaskMessageData struct{}
