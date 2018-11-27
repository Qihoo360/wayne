package models

import "time"

const TableNameIngressTemplate = "ingress_template"

type ingressTemplateModel struct {
}

type IngressTemplate struct {
	Id          int64    `orm:"auto" json:"id,omitempty"`
	Name        string   `orm:"size(128)" json:"name,omitempty"`
	Template    string   `orm:"type(text)" json:"template,omitempty"`
	Ingress     *Ingress `orm:"index;rel(fk);column(ingress_id)" json:"ingress,omitempty"`
	Description string   `orm:"size(512)" json:"description,omitempty"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	Status    []*PublishStatus `orm:"-" json:"status,omitempty"`
	IngressId int64            `orm:"-" json:"ingressId,omitempty"`
}

func (*IngressTemplate) TableName() string {
	return TableNameIngressTemplate
}

func (*ingressTemplateModel) Add(m *IngressTemplate) (id int64, err error) {
	m.Ingress = &Ingress{Id: m.IngressId}
	id, err = Ormer().Insert(m)
	return
}

func (*ingressTemplateModel) UpdateById(m *IngressTemplate) (err error) {
	v := IngressTemplate{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.Ingress = &Ingress{Id: m.IngressId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*ingressTemplateModel) GetById(id int64) (v *IngressTemplate, err error) {
	v = &IngressTemplate{Id: id}

	if err = Ormer().Read(v); err == nil {
		_, err = Ormer().LoadRelated(v, "Ingress")
		if err == nil {
			v.IngressId = v.Ingress.Id
			return v, nil
		}
	}
	return nil, err
}

func (*ingressTemplateModel) DeleteById(id int64, logical bool) (err error) {
	v := IngressTemplate{Id: id}
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
