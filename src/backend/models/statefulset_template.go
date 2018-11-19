package models

import (
	"time"
)

const (
	TableNameStatefulsetTemplate = "statefulset_template"
)

type statefulsetTplModel struct{}

type StatefulsetTemplate struct {
	Id          int64        `orm:"auto" json:"id,omitempty"`
	Name        string       `orm:"size(128)" json:"name,omitempty"`
	Template    string       `orm:"type(text)" json:"template,omitempty"`
	Statefulset *Statefulset `orm:"index;rel(fk);column(statefulset_id)" json:"statefulset,omitempty"`
	Description string       `orm:"size(512)" json:"description,omitempty"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	StatefulsetId int64            `orm:"-" json:"statefulsetId,omitempty"`
	Status        []*PublishStatus `orm:"-" json:"status,omitempty"`
}

func (*StatefulsetTemplate) TableName() string {
	return TableNameStatefulsetTemplate
}

func (*statefulsetTplModel) Add(m *StatefulsetTemplate) (id int64, err error) {
	m.Statefulset = &Statefulset{Id: m.StatefulsetId}
	id, err = Ormer().Insert(m)
	return
}

func (*statefulsetTplModel) UpdateById(m *StatefulsetTemplate) (err error) {
	v := StatefulsetTemplate{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		// 仅允许更新部分字段
		_, err = Ormer().Update(m, "Template", "Description", "Deleted")
		return err
	}
	return
}

func (*statefulsetTplModel) GetById(id int64) (v *StatefulsetTemplate, err error) {
	v = &StatefulsetTemplate{Id: id}

	if err = Ormer().Read(v); err == nil {
		_, err = Ormer().LoadRelated(v, "Statefulset")
		if err == nil {
			v.StatefulsetId = v.Statefulset.Id
			return v, nil
		}
	}
	return nil, err
}

func (*statefulsetTplModel) DeleteById(id int64, logical bool) (err error) {
	v := StatefulsetTemplate{Id: id}
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
