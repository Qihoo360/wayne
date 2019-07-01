package models

import (
	"encoding/json"
	"fmt"
	"time"

	"k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

const (
	DefaultNamespace = "demo"

	TableNameNamespace = "namespace"
)

type namespaceModel struct{}

type Namespace struct {
	Id            int64             `orm:"auto" json:"id,omitempty"`
	Name          string            `orm:"index;unique;size(128)" json:"name,omitempty"`
	KubeNamespace string            `orm:"index;size(128)" json:"kubeNamespace,omitempty"`
	MetaData      string            `orm:"type(text)" json:"metaData,omitempty"`
	MetaDataObj   NamespaceMetaData `orm:"-" json:"-"`
	CreateTime    *time.Time        `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime    *time.Time        `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User          string            `orm:"size(128)" json:"user,omitempty"`
	Deleted       bool              `orm:"default(false)" json:"deleted,omitempty"`

	// 用于权限的关联查询
	NamespaceUsers []*NamespaceUser `orm:"reverse(many)" json:"-"`
}

func (ns *Namespace) String() string {
	return fmt.Sprintf("[%d]%s", ns.Id, ns.Name)
}

func (*Namespace) TableName() string {
	return TableNameNamespace
}

type NamespaceMetaData struct {
	// key is cluster name, if the key not exist on clusterMeta
	// means this namespace could't use the cluster
	ClusterMetas map[string]ClusterMeta `json:"clusterMeta,omitempty"`
	// current namespace env, will overwrite cluster's Env
	Env []v1.EnvVar `json:"env,omitempty"`
	// current namespace image pull secrets, will overwrite cluster's ImagePullSecrets
	ImagePullSecrets []v1.LocalObjectReference `json:"imagePullSecrets"`
	// current namespace service annotation, will overwrite cluster service's Annotation
	ServiceAnnotations map[string]string `json:"serviceAnnotations,omitempty"`
	// current namespace ingress annotation, will overwrite cluster ingress's Annotation
	IngressAnnotations map[string]string `json:"ingressAnnotations,omitempty"`
}

type ClusterMeta struct {
	ResourcesLimit ResourcesLimit `json:"resourcesLimit"`
}

type ResourcesLimit struct {
	// unit core
	Cpu int64 `json:"cpu,omitempty"`
	// unit G
	Memory int64 `json:"memory,omitempty"`
}

func (*namespaceModel) GetNames(deleted bool) ([]*Namespace, error) {
	namespaces := []*Namespace{}
	_, err := Ormer().
		QueryTable(new(Namespace)).
		Filter("Deleted", deleted).
		All(&namespaces, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return namespaces, nil
}

func (*namespaceModel) GetAll(deleted bool) ([]*Namespace, error) {
	namespaces := []*Namespace{}
	_, err := Ormer().
		QueryTable(new(Namespace)).
		Filter("Deleted", deleted).
		OrderBy("Name").
		All(&namespaces)

	if err != nil {
		return nil, err
	}

	return namespaces, nil
}

func (*namespaceModel) GetByName(name string) (n *Namespace, err error) {
	n = &Namespace{Name: name}

	if err = Ormer().Read(n, "name"); err == nil {
		return n, nil
	}
	return nil, err
}

func (*namespaceModel) GetByNameAndDeleted(name string, deleted bool) (n *Namespace, err error) {
	n = &Namespace{Name: name,
		Deleted: deleted}

	if err = Ormer().Read(n, "name", "deleted"); err == nil {
		return n, nil
	}
	return nil, err
}

// Add insert a new Namespace into database and returns
// last inserted Id on success.
func (*namespaceModel) Add(m *Namespace) (id int64, err error) {
	m.CreateTime = nil
	id, err = Ormer().Insert(m)
	return
}

// UpdateById updates Namespace by Id and returns error if
// the record to be updated doesn't exist
func (*namespaceModel) UpdateById(m *Namespace) (err error) {
	v := Namespace{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.UpdateTime = nil
		_, err = Ormer().Update(m)
		return err
	}
	return
}

// GetById retrieves Namespace by Id. Returns error if
// Id doesn't exist
func (*namespaceModel) GetById(id int64) (v *Namespace, err error) {
	v = &Namespace{Id: id}

	if err = Ormer().Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// Delete deletes Namespace by Id and returns error if
// the record to be deleted doesn't exist
func (*namespaceModel) DeleteById(id int64, logical bool) (err error) {
	v := Namespace{Id: id}
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

// 初始化默认命名空间
func (*namespaceModel) InitNamespace() (err error) {
	// 检查现有数据库，避免重复插入
	defaultNS := Namespace{
		Name:     DefaultNamespace,
		User:     "system",
		MetaData: "{\"namespace\": \"default\"}",
	}
	_, _, err = Ormer().ReadOrCreate(&defaultNS, "Name")
	return
}

func (*namespaceModel) GetNamespaceByAppId(appId int64) (*Namespace, error) {
	app, err := AppModel.GetById(appId)
	if err != nil {
		logs.Warning("get app by id (%d) error. %v", appId, err)
		return nil, err
	}

	ns, err := NamespaceModel.GetById(app.Namespace.Id)
	if err != nil {
		logs.Warning("get namespace by id (%d) error. %v", app.Namespace.Id, err)
		return nil, err
	}
	var namespaceMetaData NamespaceMetaData
	err = json.Unmarshal(hack.Slice(ns.MetaData), &namespaceMetaData)
	if err != nil {
		logs.Error("Unmarshal namespace metadata (%s) error. %v", ns.MetaData, err)
		return nil, err
	}
	ns.MetaDataObj = namespaceMetaData
	return ns, nil
}
