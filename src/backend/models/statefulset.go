package models

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/astaxie/beego/logs"
	kapi "k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/util/hack"
)

const (
	TableNameStatefulset = "statefulset"
)

type statefulsetModel struct{}

type StatefulsetMetaData struct {
	Replicas  map[string]int32  `json:"replicas"`
	Resources map[string]string `json:"resources,omitempty"`
	Affinity  *kapi.Affinity    `json:"affinity,omitempty"`
	// 是否允许用户使用特权模式，默认不允许,key 为容器名称
	Privileged map[string]*bool `json:"privileged"`
}

type Statefulset struct {
	Id   int64  `orm:"auto" json:"id,omitempty"`
	Name string `orm:"unique;index;size(128)" json:"name,omitempty"`
	/* 存储元数据
	{
	  "replicas": {
	    "K8S": 1
	  },
	  "privileged":{"nginx",true},
	  "affinity": {
	    "podAntiAffinity": {
	      "requiredDuringSchedulingIgnoredDuringExecution": [
	        {
	          "labelSelector": {
	            "matchExpressions": [
	              {
	                "operator": "In",
	                "values": [
	                  "xxx"
	                ],
	                "key": "app"
	              }
	            ]
	          },
	          "topologyKey": "kubernetes.io/hostname"
	        }
	      ]
	    }
	  },
	  "resources":{
			"cpuRequestLimitPercent": "50%", // cpu request和limit百分比，默认50%
			"memoryRequestLimitPercent": "100%", // memory request和limit百分比，默认100%
			"cpuLimit":"12",  // cpu限制，默认12个核
			"memoryLimit":"64" // 内存限制，默认64G
			"replicaLimit":"32" // 份数限制，默认32份
	  }
	}
	*/
	MetaData    string              `orm:"type(text)" json:"metaData,omitempty"`
	MetaDataObj StatefulsetMetaData `orm:"-" json:"-"`
	App         *App                `orm:"index;rel(fk)" json:"app,omitempty"`
	Description string              `orm:"null;size(512)" json:"description,omitempty"`
	OrderId     int64               `orm:"index;default(0)" json:"order"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	AppId int64 `orm:"-" json:"appId,omitempty"`
}

func (*Statefulset) TableName() string {
	return TableNameStatefulset
}

func (*statefulsetModel) GetNames(filters map[string]interface{}) ([]Statefulset, error) {
	var statefulsets []Statefulset
	qs := Ormer().
		QueryTable(new(Statefulset))

	if len(filters) > 0 {
		for k, v := range filters {
			qs = qs.Filter(k, v)
		}
	}
	_, err := qs.All(&statefulsets, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return statefulsets, nil
}

func (*statefulsetModel) UpdateOrders(statefulsets []*Statefulset) error {
	if len(statefulsets) < 1 {
		return errors.New("statefulsets' length should greater than 0. ")
	}
	batchUpateSql := fmt.Sprintf("UPDATE `%s` SET `order_id` = CASE ", TableNameStatefulset)
	ids := make([]string, 0)
	for _, statefulset := range statefulsets {
		ids = append(ids, strconv.Itoa(int(statefulset.Id)))
		batchUpateSql = fmt.Sprintf("%s WHEN `id` = %d THEN %d ", batchUpateSql, statefulset.Id, statefulset.OrderId)
	}
	batchUpateSql = fmt.Sprintf("%s END WHERE `id` IN (%s)", batchUpateSql, strings.Join(ids, ","))

	_, err := Ormer().Raw(batchUpateSql).Exec()
	return err
}

func (*statefulsetModel) Add(m *Statefulset) (id int64, err error) {
	m.App = &App{Id: m.AppId}
	id, err = Ormer().Insert(m)
	return
}

func (*statefulsetModel) UpdateById(m *Statefulset) (err error) {
	v := Statefulset{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.App = &App{Id: m.AppId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*statefulsetModel) GetById(id int64) (v *Statefulset, err error) {
	v = &Statefulset{Id: id}

	if err = Ormer().Read(v); err == nil {
		v.AppId = v.App.Id
		return v, nil
	}
	return nil, err
}

func (*statefulsetModel) GetParseMetaDataById(id int64) (v *Statefulset, err error) {
	v = &Statefulset{Id: id}

	if err = Ormer().Read(v); err == nil {
		v.AppId = v.App.Id
		err = json.Unmarshal(hack.Slice(v.MetaData), &v.MetaDataObj)
		if err != nil {
			logs.Error("parse statefulset metaData error.", v.MetaData)
			return nil, err
		}
		return v, nil
	}
	return nil, err
}

func (*statefulsetModel) DeleteById(id int64, logical bool) (err error) {
	v := Statefulset{Id: id}
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
