package models

import (
	"time"
)

const (
	TableNameService = "service"
)

type Service struct {
	Id          int64  `orm:"auto" json:"id,omitempty"`
	Name        string `orm:"unique;index;size(128)" json:"name,omitempty"`
	MetaData    string `orm:"type(text)" json:"metaData,omitempty"`
	App         *App   `orm:"index;rel(fk)" json:"app,omitempty"`
	Description string `orm:"null;size(512)" json:"description,omitempty"`
	OrderId     int64  `orm:"index;default(0)" json:"order"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string     `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool       `orm:"default(false)" json:"deleted,omitempty"`

	AppId int64 `orm:"-" json:"appId,omitempty"`
}

func (*Service) TableName() string {
	return TableNameService
}
