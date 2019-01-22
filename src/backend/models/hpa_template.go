package models

import (
	"time"
)

const TableNameHPATemplate = "hpa_template"

type hpaTemplateModel struct {
}

type HPATemplate struct {
	Id          int64  `orm:"auto" json:"id,omitempty"`
	Name        string `orm:"size(128)" json:"name,omitempty"`
	Template    string `orm:"type(text)" json:"template,omitempty"`
	HPA         *HPA   `orm:"index;rel(fk);column(hpa_id)" json:"hpa,omitempty"`
	Description string `orm:"size(512)" json:"description,omitempty"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	Status []*PublishStatus `orm:"-" json:"status,omitempty"`
	HPAId  int64            `orm:"-" json:"hpaId,omitempty"`
}

func (*HPATemplate) TableName() string {
	return TableNameHPATemplate
}

func (*hpaTemplateModel) Add(m *HPATemplate) (id int64, err error) {
	m.HPA = &HPA{Id: m.HPAId}
	id, err = Ormer().Insert(m)
	return
}

func (*hpaTemplateModel) UpdateById(m *HPATemplate) (err error) {
	v := HPATemplate{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.HPA = &HPA{Id: m.Id}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*hpaTemplateModel) GetById(id int64) (v *HPATemplate, err error) {
	v = &HPATemplate{Id: id}

	if err = Ormer().Read(v); err == nil {
		_, err = Ormer().LoadRelated(v, "HPA")
		if err == nil {
			v.HPAId = v.HPA.Id
			return v, nil
		}
	}
	return nil, err
}

func (*hpaTemplateModel) DeleteById(id int64, logical bool) (err error) {
	v := HPATemplate{Id: id}
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
