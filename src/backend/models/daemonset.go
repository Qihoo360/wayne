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
	TableNameDaemonSet = "daemon_set"
)

type daemonSetModel struct{}

type DaemonSetMetaData struct {
	Resources map[string]string `json:"resources,omitempty"`
	Affinity  *kapi.Affinity    `json:"affinity,omitempty"`
	// 是否允许用户使用特权模式，默认不允许,key 为容器名称
	Privileged map[string]*bool `json:"privileged"`
}

type DaemonSet struct {
	Id   int64  `orm:"auto" json:"id,omitempty"`
	Name string `orm:"unique;index;size(128)" json:"name,omitempty"`
	/* 存储元数据
	{
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
	MetaData    string            `orm:"type(text)" json:"metaData,omitempty"`
	MetaDataObj DaemonSetMetaData `orm:"-" json:"-"`
	App         *App              `orm:"index;rel(fk)" json:"app,omitempty"`
	Description string            `orm:"null;size(512)" json:"description,omitempty"`
	OrderId     int64             `orm:"index;default(0)" json:"order"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	AppId int64 `orm:"-" json:"appId,omitempty"`
}

func (*DaemonSet) TableName() string {
	return TableNameDaemonSet
}

func (*daemonSetModel) GetNames(filters map[string]interface{}) ([]DaemonSet, error) {
	var daemonSets []DaemonSet
	qs := Ormer().
		QueryTable(new(DaemonSet))

	if len(filters) > 0 {
		for k, v := range filters {
			qs = qs.Filter(k, v)
		}
	}
	_, err := qs.All(&daemonSets, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return daemonSets, nil
}

func (*daemonSetModel) UpdateOrders(daemonSets []*DaemonSet) error {
	if len(daemonSets) < 1 {
		return errors.New("daemonSets' length should greater than 0. ")
	}
	batchUpateSql := fmt.Sprintf("UPDATE `%s` SET `order_id` = CASE ", TableNameDaemonSet)
	ids := make([]string, 0)
	for _, daemonSet := range daemonSets {
		ids = append(ids, strconv.Itoa(int(daemonSet.Id)))
		batchUpateSql = fmt.Sprintf("%s WHEN `id` = %d THEN %d ", batchUpateSql, daemonSet.Id, daemonSet.OrderId)
	}
	batchUpateSql = fmt.Sprintf("%s END WHERE `id` IN (%s)", batchUpateSql, strings.Join(ids, ","))

	_, err := Ormer().Raw(batchUpateSql).Exec()
	return err
}

func (*daemonSetModel) Add(m *DaemonSet) (id int64, err error) {
	m.App = &App{Id: m.AppId}
	id, err = Ormer().Insert(m)
	return
}

func (*daemonSetModel) UpdateById(m *DaemonSet) (err error) {
	v := DaemonSet{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.App = &App{Id: m.AppId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*daemonSetModel) GetById(id int64) (v *DaemonSet, err error) {
	v = &DaemonSet{Id: id}

	if err = Ormer().Read(v); err == nil {
		v.AppId = v.App.Id
		return v, nil
	}
	return nil, err
}

func (*daemonSetModel) GetParseMetaDataById(id int64) (v *DaemonSet, err error) {
	v = &DaemonSet{Id: id}

	if err = Ormer().Read(v); err == nil {
		v.AppId = v.App.Id
		err = json.Unmarshal(hack.Slice(v.MetaData), &v.MetaDataObj)
		if err != nil {
			logs.Error("parse daemonSet metaData error.", v.MetaData)
			return nil, err
		}
		return v, nil
	}
	return nil, err
}

func (*daemonSetModel) DeleteById(id int64, logical bool) (err error) {
	v := DaemonSet{Id: id}
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
