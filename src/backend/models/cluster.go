package models

import (
	"encoding/json"
	"time"

	"github.com/astaxie/beego/logs"
	v1 "k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/util/hack"
)

type ClusterStatus int32

const (
	ClusterStatusNormal      ClusterStatus = 0
	ClusterStatusMaintaining ClusterStatus = 1

	TableNameCluster = "cluster"
)

type clusterModel struct{}

type Cluster struct {
	Id          int64  `orm:"auto" json:"id,omitempty"`
	Name        string `orm:"unique;index;size(128)" json:"name,omitempty"`
	DisplayName string `orm:"size(512);column(displayname);null" json:"displayname,omitempty"`
	/*
		   {
			  "robin": {
		          "token": "robin token",
		          "url":"http://10.10.10.10:8080",
		          "sftpPort": 2022,
		          "passwordDesKey": "Dhg4YuMn"   // change one or more character，the length must be 8.
		       },
			  "rbd": {              // rbd默认配置，创建或修改RBD类型的PV时会使用此配置填充
			    "monitors": [
			      "10.10.10.1:6789",
			      "10.10.10.2:6789",
			      "10.10.10.3:6789"
			    ],
			    "fsType": "xfs",
			    "pool": "k8s_pool",
			    "user": "search",
			    "keyring": "/etc/ceph/ceph.client.search.keyring"
			  },
			  "cephfs": {         // cephfs默认配置，创建或修改cephfs类型的PV时会使用此配置填充
			    "monitors": [
			      "10.10.10.4:6789",
			      "10.10.10.5:6789",
			      "10.10.10.6:6789"
			    ],
			    "user": "search",
			    "secretRef": {
			      "name": "infra-cephfs"
			    }
			  }
			}
	*/
	MetaData    string     `orm:"null;type(text)" json:"metaData,omitempty"`
	Master      string     `orm:"size(128)" json:"master,omitempty"` // apiserver地址，示例： https://10.172.189.140
	KubeConfig  string     `orm:"null;type(text)" json:"kubeConfig,omitempty"`
	Description string     `orm:"null;size(512)" json:"description,omitempty"`
	CreateTime  *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime  *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User        string     `orm:"size(128)" json:"user,omitempty"`
	Deleted     bool       `orm:"default(false)" json:"deleted,omitempty"`
	// the cluster status
	Status ClusterStatus `orm:"default(0)" json:"status"`

	MetaDataObj ClusterMetaData `orm:"-" json:"-"`
}

type ClusterMetaData struct {
	// robin plugin
	Robin *ClusterRobinMetaData `json:"robin"`
	// kubetool log source
	LogSource string `json:"logSource"`
	// rbd默认配置，创建或修改RBD类型的PV时会使用此配置填充
	RBD *v1.RBDVolumeSource `json:"rbd"`
	// cephfs默认配置，创建或修改cephfs类型的PV时会使用此配置填充
	CephFS *v1.CephFSVolumeSource `json:"cephfs"`
	// 默认添加环境变量，会在发布资源时在每个Container添加此环境变量, will be overwrite by namespace's Env
	Env []v1.EnvVar
	// current cluster image pull secrets, will be overwrite by namespace's ImagePullSecrets
	ImagePullSecrets []v1.LocalObjectReference `json:"imagePullSecrets"`
	// 默认添加service注解，会在发布资源时在每个service添加此Annotations, will be overwrite by namespace's Annotations
	ServiceAnnotations map[string]string `json:"serviceAnnotations,omitempty"`
	// 默认添加ingress注解，会在发布资源时在每个ingress添加此Annotations, will be overwrite by namespace's Annotations
	IngressAnnotations map[string]string `json:"ingressAnnotations,omitempty"`
}

type ClusterRobinMetaData struct {
	Token          string `json:"token"`
	Url            string `json:"url"`
	SftpPort       int    `json:"sftpPort"`
	PasswordDesKey string `json:"passwordDesKey"`
}

func (*Cluster) TableName() string {
	return TableNameCluster
}

func (*clusterModel) GetNames(deleted bool) ([]Cluster, error) {
	clusters := []Cluster{}
	_, err := Ormer().
		QueryTable(new(Cluster)).
		Filter("Deleted", deleted).
		All(&clusters, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return clusters, nil
}

func (*clusterModel) GetAllNormal() ([]Cluster, error) {
	clusters := []Cluster{}
	_, err := Ormer().
		QueryTable(new(Cluster)).
		Filter("Status", ClusterStatusNormal).
		Filter("Deleted", false).
		All(&clusters)

	if err != nil {
		return nil, err
	}

	return clusters, nil
}

func (*clusterModel) ClusterMetaData(cluster string) (*ClusterMetaData, error) {
	clu, err := ClusterModel.GetByName(cluster)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(hack.Slice(clu.MetaData), &clu.MetaDataObj)
	if err != nil {
		return nil, err
	}
	return &clu.MetaDataObj, nil
}

// Add insert a new Cluster into database and returns
// last inserted Id on success.
func (*clusterModel) Add(m *Cluster) (id int64, err error) {
	m.CreateTime = nil
	id, err = Ormer().Insert(m)
	return
}

// GetByName retrieves Cluster by Name. Returns error if
// Id doesn't exist
func (*clusterModel) GetByName(name string) (v *Cluster, err error) {
	v = &Cluster{Name: name}

	if err = Ormer().Read(v, "Name"); err == nil {
		return v, nil
	}
	return nil, err
}

// GetByName retrieves Cluster by Name. Returns error if
// Id doesn't exist
func (*clusterModel) GetParsedMetaDataByName(name string) (v *Cluster, err error) {
	v = &Cluster{Name: name}

	if err = Ormer().Read(v, "Name"); err == nil {
		if v.MetaData != "" {
			err := json.Unmarshal(hack.Slice(v.MetaData), &v.MetaDataObj)
			if err != nil {
				logs.Error("parse cluster metaData error.", v.MetaData)
				return nil, err
			}
		}

		return v, nil
	}
	return nil, err
}

// GetById retrieves Cluster by Id. Returns error if
// Id doesn't exist
func (*clusterModel) GetById(id int64) (v *Cluster, err error) {
	v = &Cluster{Id: id}

	if err = Ormer().Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateCluster updates Cluster by Name and returns error if
// the record to be updated doesn't exist
func (*clusterModel) UpdateByName(m *Cluster) (err error) {
	v := Cluster{Name: m.Name}
	// ascertain id exists in the database
	if err = Ormer().Read(&v, "Name"); err == nil {
		m.UpdateTime = nil
		_, err = Ormer().Update(m)
		return err
	}
	return
}

// Delete deletes Cluster by Id and returns error if
// the record to be deleted doesn't exist
func (*clusterModel) DeleteByName(name string, logical bool) (err error) {
	v := Cluster{Name: name}
	// ascertain id exists in the database
	if err = Ormer().Read(&v, "Name"); err == nil {
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
