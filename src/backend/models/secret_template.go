package models

import (
	"time"
)

const (
	TableNameSecretTemplate = "secret_template"
)

type secretTplModel struct{}

type SecretTemplate struct {
	Id       int64   `orm:"auto" json:"id,omitempty"`
	Name     string  `orm:"size(128)" json:"name,omitempty"`
	Template string  `orm:"type(text)" json:"template,omitempty"`
	Secret   *Secret `orm:"index;rel(fk);column(secret_map_id)" json:"secret,omitempty"`
	// 存储模版可上线机房
	// 例如{"clusters":["K8S"]}
	MetaData    string `orm:"type(text)" json:"metaData,omitempty"`
	Description string `orm:"size(512)" json:"description,omitempty"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	Status   []*PublishStatus `orm:"-" json:"status,omitempty"`
	SecretId int64            `orm:"-" json:"secretId,omitempty"`
}

func (*SecretTemplate) TableName() string {
	return TableNameSecretTemplate
}

func (*secretTplModel) Add(m *SecretTemplate) (id int64, err error) {
	m.Secret = &Secret{Id: m.SecretId}
	id, err = Ormer().Insert(m)
	return
}

func (*secretTplModel) UpdateById(m *SecretTemplate) (err error) {
	v := SecretTemplate{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.Secret = &Secret{Id: m.SecretId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*secretTplModel) GetById(id int64) (v *SecretTemplate, err error) {
	v = &SecretTemplate{Id: id}

	if err = Ormer().Read(v); err == nil {
		_, err = Ormer().LoadRelated(v, "Secret")
		if err == nil {
			v.SecretId = v.Secret.Id
			return v, nil
		}
	}
	return nil, err
}

func (*secretTplModel) DeleteById(id int64, logical bool) (err error) {
	v := SecretTemplate{Id: id}
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
