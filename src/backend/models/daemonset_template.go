package models

import (
	"time"
)

const (
	TableNameDaemonSetTemplate = "daemon_set_template"
)

type daemonSetTplModel struct{}

type DaemonSetTemplate struct {
	Id          int64      `orm:"auto" json:"id,omitempty"`
	Name        string     `orm:"size(128)" json:"name,omitempty"`
	Template    string     `orm:"type(text)" json:"template,omitempty"`
	DaemonSet   *DaemonSet `orm:"index;rel(fk)" json:"daemonSet,omitempty"`
	Description string     `orm:"size(512)" json:"description,omitempty"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	DaemonSetId int64            `orm:"-" json:"daemonSetId,omitempty"`
	Status      []*PublishStatus `orm:"-" json:"status,omitempty"`
}

func (*DaemonSetTemplate) TableName() string {
	return TableNameDaemonSetTemplate
}

func (*daemonSetTplModel) Add(m *DaemonSetTemplate) (id int64, err error) {
	m.DaemonSet = &DaemonSet{Id: m.DaemonSetId}
	id, err = Ormer().Insert(m)
	return
}

func (*daemonSetTplModel) UpdateById(m *DaemonSetTemplate) (err error) {
	v := DaemonSetTemplate{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		// 仅允许更新部分字段
		_, err = Ormer().Update(m, "Template", "Description", "Deleted")
		return err
	}
	return
}

func (*daemonSetTplModel) GetById(id int64) (v *DaemonSetTemplate, err error) {
	v = &DaemonSetTemplate{Id: id}

	if err = Ormer().Read(v); err == nil {
		_, err = Ormer().LoadRelated(v, "DaemonSet")
		if err == nil {
			v.DaemonSetId = v.DaemonSet.Id
			return v, nil
		}
	}
	return nil, err
}

func (*daemonSetTplModel) DeleteById(id int64, logical bool) (err error) {
	v := DaemonSetTemplate{Id: id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		if logical {
			v.Deleted = true
			_, err = Ormer().Update(&v)
			return err
		}
		_, err = Ormer().Delete(&v)
		return err
	}
	return
}
