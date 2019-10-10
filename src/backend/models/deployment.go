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
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

const (
	TableNameDeployment = "deployment"
)

type deploymentModel struct{}

type DeploymentMetaData struct {
	Replicas  map[string]int32  `json:"replicas"`
	Resources map[string]string `json:"resources,omitempty"`
	Affinity  *kapi.Affinity    `json:"affinity,omitempty"`
	// 是否允许用户使用特权模式，默认不允许,key 为容器名称
	Privileged map[string]*bool `json:"privileged"`
}

type Deployment struct {
	Id   int64  `orm:"auto" json:"id,omitempty"`
	Name string `orm:"unique;index;size(128)" json:"name,omitempty"`
	/* 存储部署元数据
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
			"replicaLimit":"32" // 部署份数限制，默认32份
	  }
	}
	*/
	MetaData    string             `orm:"type(text)" json:"metaData,omitempty"`
	MetaDataObj DeploymentMetaData `orm:"-" json:"-"`
	App         *App               `orm:"index;rel(fk)" json:"app,omitempty"`
	Description string             `orm:"null;size(512)" json:"description,omitempty"`
	OrderId     int64              `orm:"index;default(0)" json:"order"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string     `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool       `orm:"default(false)" json:"deleted,omitempty"`

	AppId int64 `orm:"-" json:"appId,omitempty"`
}

func (*Deployment) TableName() string {
	return TableNameDeployment
}

func (*deploymentModel) GetNames(filters map[string]interface{}) ([]Deployment, error) {
	deployments := []Deployment{}
	qs := Ormer().
		QueryTable(new(Deployment))

	if len(filters) > 0 {
		for k, v := range filters {
			qs = qs.Filter(k, v)
		}
	}
	_, err := qs.All(&deployments, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return deployments, nil
}

func (*deploymentModel) UpdateOrders(deployments []*Deployment) error {
	if len(deployments) < 1 {
		return errors.New("deployments' length should greater than 0. ")
	}
	batchUpateSql := fmt.Sprintf("UPDATE `%s` SET `order_id` = CASE ", TableNameDeployment)
	ids := make([]string, 0)
	for _, deployment := range deployments {
		ids = append(ids, strconv.Itoa(int(deployment.Id)))
		batchUpateSql = fmt.Sprintf("%s WHEN `id` = %d THEN %d ", batchUpateSql, deployment.Id, deployment.OrderId)
	}
	batchUpateSql = fmt.Sprintf("%s END WHERE `id` IN (%s)", batchUpateSql, strings.Join(ids, ","))

	_, err := Ormer().Raw(batchUpateSql).Exec()
	return err
}

func (*deploymentModel) Add(m *Deployment) (id int64, err error) {
	m.App = &App{Id: m.AppId}
	m.CreateTime = nil
	id, err = Ormer().Insert(m)
	return
}

func (*deploymentModel) UpdateById(m *Deployment) (err error) {
	v := Deployment{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.App = &App{Id: m.AppId}
		m.UpdateTime = nil
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*deploymentModel) GetById(id int64) (v *Deployment, err error) {
	v = &Deployment{Id: id}

	if err = Ormer().Read(v); err == nil {
		v.AppId = v.App.Id
		return v, nil
	}
	return nil, err
}

func (*deploymentModel) GetParseMetaDataById(id int64) (v *Deployment, err error) {
	v = &Deployment{Id: id}

	if err = Ormer().Read(v); err == nil {
		v.AppId = v.App.Id
		err = json.Unmarshal(hack.Slice(v.MetaData), &v.MetaDataObj)
		if err != nil {
			logs.Error("parse deployment metaData error.", v.MetaData)
			return nil, err
		}
		return v, nil
	}
	return nil, err
}

func (*deploymentModel) GetByName(name string) (v *Deployment, err error) {
	v = &Deployment{Name: name}

	if err = Ormer().Read(v, "name"); err == nil {
		v.AppId = v.App.Id
		return v, nil
	}
	return nil, err
}

func (*deploymentModel) GetUniqueDepByName(ns, app, deployment string) (v *Deployment, err error) {
	v = &Deployment{}
	// use orm
	qs := Ormer().QueryTable(new(Deployment))
	err = qs.Filter("App__Namespace__Name", ns).Filter("App__Name", app).Filter("Name", deployment).Filter("Deleted", 0).One(v)
	// use raw sql
	// err = Ormer().Raw("SELECT d.* FROM deployment as d left join app as a on d.app_id=a.id left join namespace as n on a.namespace_id=n.id WHERE n.name= ? and a.Name = ? and d.Name = ?", ns, app, deployment).QueryRow(v)
	if err == nil {
		v.AppId = v.App.Id
		return v, nil
	}
	return nil, err
}

func (*deploymentModel) DeleteById(id int64, logical bool) (err error) {
	v := Deployment{Id: id}
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

func (d *deploymentModel) Update(replicas int32, deploy *Deployment, cluster string) (err error) {
	deploy.MetaDataObj.Replicas[cluster] = replicas
	newMetaData, err := json.Marshal(&deploy.MetaDataObj)
	if err != nil {
		logs.Error("deployment metadata marshal error.%v", err)
		return
	}
	deploy.MetaData = string(newMetaData)
	err = d.UpdateById(deploy)
	if err != nil {
		logs.Error("deployment metadata update error.%v", err)
	}
	return
}
