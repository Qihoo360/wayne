package models

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
)

const (
	TableNameConfigMap = "config_map"
)

type configMapModel struct{}

type ConfigMap struct {
	Id          int64  `orm:"auto" json:"id,omitempty"`
	Name        string `orm:"unique;size(128)" json:"name,omitempty"`
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

func (*ConfigMap) TableName() string {
	return TableNameConfigMap
}

func (*configMapModel) GetNames(filters map[string]interface{}) ([]ConfigMap, error) {
	configMaps := []ConfigMap{}
	qs := Ormer().
		QueryTable(new(ConfigMap))

	if len(filters) > 0 {
		for k, v := range filters {
			qs = qs.Filter(k, v)
		}
	}
	_, err := qs.All(&configMaps, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return configMaps, nil
}

func (*configMapModel) UpdateOrders(configMaps []*ConfigMap) error {
	if len(configMaps) < 1 {
		return errors.New("configMaps' length should greater than 0. ")
	}
	batchUpateSql := fmt.Sprintf("UPDATE `%s` SET `order_id` = CASE ", TableNameConfigMap)
	ids := make([]string, 0)
	for _, configMap := range configMaps {
		ids = append(ids, strconv.Itoa(int(configMap.Id)))
		batchUpateSql = fmt.Sprintf("%s WHEN `id` = %d THEN %d ", batchUpateSql, configMap.Id, configMap.OrderId)
	}
	batchUpateSql = fmt.Sprintf("%s END WHERE `id` IN (%s)", batchUpateSql, strings.Join(ids, ","))

	_, err := Ormer().Raw(batchUpateSql).Exec()
	return err
}

func (*configMapModel) Add(m *ConfigMap) (id int64, err error) {
	m.App = &App{Id: m.AppId}
	m.CreateTime = nil
	id, err = Ormer().Insert(m)
	return
}

func (*configMapModel) UpdateById(m *ConfigMap) (err error) {
	v := ConfigMap{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.UpdateTime = nil
		m.App = &App{Id: m.AppId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*configMapModel) GetById(id int64) (v *ConfigMap, err error) {
	v = &ConfigMap{Id: id}

	if err = Ormer().Read(v); err == nil {
		v.AppId = v.App.Id
		return v, nil
	}
	return nil, err
}

func (*configMapModel) DeleteById(id int64, logical bool) (err error) {
	v := ConfigMap{Id: id}
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
