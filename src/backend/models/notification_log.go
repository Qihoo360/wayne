package models

import (
	"fmt"
	"time"
)

const (
	TableNameNotificationLog = "notification_log"
)

type notificationLogModel struct{}

type NotificationLog struct {
	Id           int64         `orm:"auto" json:"id,omitempty"`
	UserId       int64         `orm:"default(0)" json:"user_id,omitempty"`
	CreateTime   *time.Time    `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	IsReaded     bool          `orm:"default(false)" json:"is_readed"`
	Notification *Notification `orm:"index;column(notification_id);rel(fk)" json:"notification"`
}

func (*NotificationLog) TableName() string {
	return TableNameNotificationLog
}

func (*notificationLogModel) AddToAllUser(notificationId int64) (err error) {
	sql := fmt.Sprintf("insert into notification_log (notification_id,user_id,create_time) select %d,id,now() from user", notificationId)
	_, err = Ormer().Raw(sql).Exec()
	return err
}

func (*notificationLogModel) UpdateByUserId(nlg *NotificationLog) (err error) {
	v := NotificationLog{UserId: nlg.UserId, Id: nlg.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v, "UserId", "id"); err == nil {
		_, err := Ormer().Update(nlg, "IsReaded")
		return err
	}
	return err
}
