package models

import (
	"time"
)

const (
	TableNameCronjobTemplate = "cronjob_template"
)

type cronjobTplModel struct{}

type CronjobTemplate struct {
	Id          int64    `orm:"auto" json:"id,omitempty"`
	Name        string   `orm:"size(128)" json:"name,omitempty"`
	Template    string   `orm:"type(text)" json:"template,omitempty"`
	Cronjob     *Cronjob `orm:"index;rel(fk);column(cronjob_id)" json:"cronjob,omitempty"`
	MetaData    string   `orm:"type(text)" json:"metaData,omitempty"`
	Description string   `orm:"size(512)" json:"description,omitempty"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	Status    []*PublishStatus `orm:"-" json:"status,omitempty"`
	CronjobId int64            `orm:"-" json:"cronjobId,omitempty"`
}

func (*CronjobTemplate) TableName() string {
	return TableNameCronjobTemplate
}

func (*cronjobTplModel) Add(m *CronjobTemplate) (id int64, err error) {
	m.Cronjob = &Cronjob{Id: m.CronjobId}
	id, err = Ormer().Insert(m)
	return
}

func (*cronjobTplModel) UpdateById(m *CronjobTemplate) (err error) {
	v := CronjobTemplate{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.Cronjob = &Cronjob{Id: m.CronjobId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*cronjobTplModel) GetById(id int64) (v *CronjobTemplate, err error) {
	v = &CronjobTemplate{Id: id}

	if err = Ormer().Read(v); err == nil {
		_, err = Ormer().LoadRelated(v, "Cronjob")
		if err == nil {
			v.CronjobId = v.Cronjob.Id
			return v, nil
		}
	}
	return nil, err
}

func (*cronjobTplModel) DeleteById(id int64, logical bool) (err error) {
	v := CronjobTemplate{Id: id}
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
