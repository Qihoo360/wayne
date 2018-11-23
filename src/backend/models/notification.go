package models

import (
	"time"
)

const (
	TableNameNotification = "notification"
)

type notificationModel struct{}

type NotificationType string

const (
	NoticeNotification  NotificationType = "公告"
	WarningNotification NotificationType = "警告"
)

type NotificationLevel int

const (
	LowNotification NotificationLevel = iota
	MiddleNotification
	HighNotification
)

type Notification struct {
	Id          int64             `orm:"auto" json:"id,omitempty"`
	Type        NotificationType  `orm:"index;size(128)" json:"type,omitempty"`
	Title       string            `orm:"size(2000)" json:"title,omitempty"`
	Message     string            `orm:"type(text)" json:"message,omitempty"`
	FromUser    *User             `orm:"index;rel(fk)" json:"from,omitempty"`
	Level       NotificationLevel `orm:"default(0)" json:"level,omitempty"`
	IsPublished bool              `orm:"default(false)" json:"is_published"`
	CreateTime  *time.Time        `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime  *time.Time        `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
}

func (*Notification) TableName() string {
	return TableNameNotification
}

func (*notificationModel) Add(n *Notification) (id int64, err error) {
	// 创建通知
	id, err = Ormer().Insert(n)
	if err != nil {
		return
	}
	return
}

func (*notificationModel) UpdateById(n *Notification) (err error) {
	v := Notification{Id: n.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		_, err := Ormer().Update(n, "IsPublished")
		return err
	}
	return err
}
