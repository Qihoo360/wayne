package models

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	kapi "k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/util/hack"
)

const (
	TableNameCronjob = "cronjob"
)

type cronjobModel struct{}

type CronjobMetaData struct {
	Replicas map[string]int32 `json:"replicas"`
	Suspends map[string]bool  `json:"suspends"`
	Affinity *kapi.Affinity   `json:"affinity,omitempty"`
	// 是否允许用户使用特权模式，默认不允许,key 为容器名称
	Privileged map[string]*bool `json:"privileged"`
}

type Cronjob struct {
	Id   int64  `orm:"auto" json:"id,omitempty"`
	Name string `orm:"unique;size(128)" json:"name,omitempty"`
	// 存储模版可上线机房，已挂起的机房
	/*
		{
		  "replicas": {
		    "K8S": 1
		  },
		}
	*/
	MetaData    string          `orm:"type(text)" json:"metaData,omitempty"`
	MetaDataObj CronjobMetaData `orm:"-" json:"-"`
	App         *App            `orm:"index;rel(fk)" json:"app,omitempty"`
	Description string          `orm:"null;size(512)" json:"description,omitempty"`
	OrderId     int64           `orm:"index;default(0)" json:"order"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string     `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool       `orm:"default(false)" json:"deleted,omitempty"`

	AppId int64 `orm:"-" json:"appId,omitempty"`
}

func (*Cronjob) TableName() string {
	return TableNameCronjob
}

func (*cronjobModel) GetNames(filters map[string]interface{}) ([]Cronjob, error) {
	cronjobs := []Cronjob{}
	qs := Ormer().
		QueryTable(new(Cronjob))

	if len(filters) > 0 {
		for k, v := range filters {
			qs = qs.Filter(k, v)
		}
	}
	_, err := qs.All(&cronjobs, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return cronjobs, nil
}

func (*cronjobModel) UpdateOrders(cronjobs []*Cronjob) error {
	if len(cronjobs) < 1 {
		return errors.New("cronjobs' length should greater than 0. ")
	}
	batchUpateSql := fmt.Sprintf("UPDATE `%s` SET `order_id` = CASE ", TableNameCronjob)
	ids := make([]string, 0)
	for _, cronjob := range cronjobs {
		ids = append(ids, strconv.Itoa(int(cronjob.Id)))
		batchUpateSql = fmt.Sprintf("%s WHEN `id` = %d THEN %d ", batchUpateSql, cronjob.Id, cronjob.OrderId)
	}
	batchUpateSql = fmt.Sprintf("%s END WHERE `id` IN (%s)", batchUpateSql, strings.Join(ids, ","))

	_, err := Ormer().Raw(batchUpateSql).Exec()
	return err
}

func (*cronjobModel) Add(m *Cronjob) (id int64, err error) {
	m.App = &App{Id: m.AppId}
	m.CreateTime = nil
	id, err = Ormer().Insert(m)
	return
}

func (*cronjobModel) UpdateById(m *Cronjob) (err error) {
	v := Cronjob{Id: m.Id}
	if err = Ormer().Read(&v); err == nil {
		m.UpdateTime = nil
		m.App = &App{Id: m.AppId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*cronjobModel) GetById(id int64) (v *Cronjob, err error) {
	v = &Cronjob{Id: id}

	if err = Ormer().Read(v); err == nil {
		v.AppId = v.App.Id
		return v, nil
	}
	return nil, err
}

func (*cronjobModel) GetParseMetaDataById(id int64) (v *Cronjob, err error) {
	v = &Cronjob{Id: id}

	if err = Ormer().Read(v); err == nil {
		v.AppId = v.App.Id
		err = json.Unmarshal(hack.Slice(v.MetaData), &v.MetaDataObj)
		if err != nil {
			return nil, err
		}
		return v, nil
	}
	return nil, err
}

func (*cronjobModel) DeleteById(id int64, logical bool) (err error) {
	v := Cronjob{Id: id}
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
