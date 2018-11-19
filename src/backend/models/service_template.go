package models

import (
	"time"
)

const (
	TableNameServiceTemplate = "service_template"
)

type ServiceTemplate struct {
	Id          int64    `orm:"auto" json:"id,omitempty"`
	Name        string   `orm:"size(128)" json:"name,omitempty"`
	Template    string   `orm:"type(text)" json:"template,omitempty"`
	Service     *Service `orm:"index;rel(fk);column(service_id)" json:"service,omitempty"`
	Description string   `orm:"size(512)" json:"description,omitempty"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	Status    []*PublishStatus `orm:"-" json:"status,omitempty"`
	ServiceId int64            `orm:"-" json:"serviceId,omitempty"`
}

func (*ServiceTemplate) TableName() string {
	return TableNameServiceTemplate
}
