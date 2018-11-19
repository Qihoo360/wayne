package models

import (
	"time"
)

const (
	TableNameConfigMapTemplate = "config_map_template"
)

type configMapTplModel struct{}

type ConfigMapTemplate struct {
	Id        int64      `orm:"auto" json:"id,omitempty"`
	Name      string     `orm:"size(128)" json:"name,omitempty"`
	Template  string     `orm:"type(text)" json:"template,omitempty"`
	ConfigMap *ConfigMap `orm:"index;rel(fk);column(config_map_id)" json:"configMap,omitempty"`
	// 存储模版可上线机房
	// 例如{"clusters":["K8S"]}
	MetaData    string `orm:"type(text)" json:"metaData,omitempty"`
	Description string `orm:"size(512)" json:"description,omitempty"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	Status      []*PublishStatus `orm:"-" json:"status,omitempty"`
	ConfigMapId int64            `orm:"-" json:"configMapId,omitempty"`
}

func (*ConfigMapTemplate) TableName() string {
	return TableNameConfigMapTemplate
}

func (*configMapTplModel) Add(m *ConfigMapTemplate) (id int64, err error) {
	m.ConfigMap = &ConfigMap{Id: m.ConfigMapId}
	id, err = Ormer().Insert(m)
	return
}

func (*configMapTplModel) UpdateById(m *ConfigMapTemplate) (err error) {
	v := ConfigMapTemplate{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.ConfigMap = &ConfigMap{Id: m.ConfigMapId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*configMapTplModel) GetById(id int64) (v *ConfigMapTemplate, err error) {
	v = &ConfigMapTemplate{Id: id}

	if err = Ormer().Read(v); err == nil {
		_, err = Ormer().LoadRelated(v, "ConfigMap")
		if err == nil {
			v.ConfigMapId = v.ConfigMap.Id
			return v, nil
		}
	}
	return nil, err
}

func (*configMapTplModel) DeleteById(id int64, logical bool) (err error) {
	v := ConfigMapTemplate{Id: id}
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
