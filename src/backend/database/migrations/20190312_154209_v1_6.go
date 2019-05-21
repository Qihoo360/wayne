package migrations

import (
	"encoding/json"

	"github.com/astaxie/beego/migration"
	"github.com/astaxie/beego/orm"

	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type NamespaceMetaData struct {
	// kubernetes' namespace
	Namespace string `json:"namespace,omitempty"`
}

// DO NOT MODIFY
type V16_20190312_154209 struct {
	migration.Migration
}

// DO NOT MODIFY
func init() {
	m := &V16_20190312_154209{}
	m.Created = "20190312_154209"

	migration.Register("V16_20190312_154209", m)
}

// Run the migrations
func (m *V16_20190312_154209) Up() {
	// For migration namespace metadata namespace to kubeNamespace
	o := orm.NewOrm()
	namespaces := []*models.Namespace{}
	_, err := o.QueryTable(new(models.Namespace)).
		All(&namespaces)
	if err != nil {
		logs.Error("Get all namespaces error.", err)
		return
	}
	for _, namespace := range namespaces {
		if namespace.MetaData != "" {
			metadata := &NamespaceMetaData{}
			err := json.Unmarshal([]byte(namespace.MetaData), metadata)
			if err != nil {
				logs.Error("json.Unmarshal namespaces error.", namespace, err)
				continue
			}
			if metadata.Namespace != "" {
				namespace.KubeNamespace = metadata.Namespace
				_, err := o.Update(namespace)
				if err != nil {
					logs.Error("update namespaces error.", namespace, err)
					continue
				}
			}
		}
	}

	// use m.SQL("CREATE TABLE ...") to make schema update

}

// Reverse the migrations
func (m *V16_20190312_154209) Down() {
	// use m.SQL("DROP TABLE ...") to reverse schema update

}
