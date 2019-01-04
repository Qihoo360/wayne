package models

import (
	"strings"
	"time"

	"github.com/astaxie/beego/orm"

	"github.com/Qihoo360/wayne/src/backend/models/hookevent"
)

type WebHookScope int64

const (
	WebHookScopeNamespace WebHookScope = iota
	WebHookScopeApp

	TableNameWebHook = "web_hook"
)

type webHookModel struct{}

type WebHook struct {
	Id       int64        `orm:"auto" json:"id"`
	Name     string       `orm:"index;size(128)" json:"name"`
	Scope    WebHookScope `json:"scope"`
	ObjectId int64        `json:"objectId"`

	Url    string `orm:"null;size(512)" json:"url"`
	Secret string `orm:"null;size(512)" json:"secret"`
	Events string `orm:"type(text)" json:"events"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime"`
	User       string     `orm:"size(128)" json:"user"`
	Enabled    bool       `orm:"default(false)" json:"enabled"`
}

func (*WebHook) TableUnique() [][]string {
	return [][]string{
		{"Scope", "ObjectId", "Name"},
	}
}

func (h *WebHook) GetHookEvents() []*hookevent.HookEvent {
	var events []*hookevent.HookEvent
	for _, key := range strings.Split(h.Events, ",") {
		event, ok := hookevent.AllHookEvents[key]
		if ok {
			events = append(events, event)
		}
	}

	return events
}

func (*WebHook) TableName() string {
	return TableNameWebHook
}

func (*webHookModel) GetAll(filters map[string]interface{}) ([]WebHook, error) {
	var webHooks []WebHook
	qs := Ormer().
		QueryTable(new(WebHook))

	if len(filters) > 0 {
		for k, v := range filters {
			qs = qs.Filter(k, v)
		}
	}
	_, err := qs.All(&webHooks, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return webHooks, nil
}

func (*webHookModel) Add(m *WebHook) (id int64, err error) {
	o := orm.NewOrm()
	err = o.Begin()
	if err != nil {
		return
	}
	m.CreateTime = nil
	id, err = o.Insert(m)
	if err != nil {
		o.Rollback()
		return
	}
	o.Commit()
	return
}

func (*webHookModel) UpdateById(m *WebHook) (err error) {
	o := orm.NewOrm()
	err = o.Begin()
	if err != nil {
		return
	}
	v := WebHook{Id: m.Id}

	if err = o.Read(&v); err != nil {
		return
	}
	m.UpdateTime = nil
	if _, err = o.Update(m); err != nil {
		o.Rollback()
		return
	}
	o.Commit()
	return
}

func (*webHookModel) GetById(id int64) (m *WebHook, err error) {
	m = &WebHook{Id: id}

	if err = Ormer().Read(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (*webHookModel) DeleteById(id int64) (err error) {
	o := orm.NewOrm()
	m := WebHook{Id: id}
	if err = o.Read(&m); err != nil {
		o.Rollback()
		return
	}

	if _, err = o.Delete(&m); err != nil {
		Ormer().Rollback()
		return
	}

	o.Commit()
	return
}

func (*webHookModel) GetUrl(filters map[string]interface{}) ([]WebHook, error) {
	var webHooks []WebHook
	qs := Ormer().QueryTable(new(WebHook))
	if len(filters) > 0 {
		for k, v := range filters {
			qs = qs.Filter(k, v)
		}
	}
	_, err := qs.All(&webHooks, "Id", "Url")
	if err != nil {
		return nil, err
	}
	return webHooks, nil
}

func (*webHookModel) GetTriggered(namespaceId int64, appId int64, event string) ([]WebHook, error) {
	o := orm.NewOrm()
	sql := "select * from web_hook where (scope = ? AND object_id = ?) OR (scope= ? AND object_id = ?)"
	args := [...]interface{}{
		WebHookScopeNamespace,
		namespaceId,
		WebHookScopeApp,
		appId,
	}
	var webHooks []WebHook
	o.Raw(sql, args).QueryRows(&webHooks)
	var triggered []WebHook
	for _, hook := range webHooks {
		for _, e := range hook.GetHookEvents() {
			if e.Key == event {
				triggered = append(triggered, hook)
			}
		}
	}

	return triggered, nil
}
