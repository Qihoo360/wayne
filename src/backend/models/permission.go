package models

import (
	"errors"
	"fmt"
	"strings"
	"time"
)

const (
	TableNamePermission = "permission"

	PermissionCreate  = "CREATE"
	PermissionUpdate  = "UPDATE"
	PermissionRead    = "READ"
	PermissionDelete  = "DELETE"
	PermissionDeploy  = "DEPLOY"
	PermissionOffline = "OFFLINE"

	PermissionTypeApp                   = "APP"
	PermissionTypeAppUser               = "APPUSER"
	PermissionTypeDeployment            = "DEPLOYMENT"
	PermissionTypeSecret                = "SECRET"
	PermissionTypeService               = "SERVICE"
	PermissionTypeConfigMap             = "CONFIGMAP"
	PermissionTypeCronjob               = "CRONJOB"
	PermissionTypePersistentVolumeClaim = "PVC"
	PermissionTypeNamespace             = "NAMESPACE"
	PermissionTypeNamespaceUser         = "NAMESPACEUSER"
	PermissionTypeWebHook               = "WEBHOOK"
	PermissionTypeStatefulset           = "STATEFULSET"
	PermissionTypeDaemonSet             = "DAEMONSET"
	PermissionBill                      = "BILL"
	PermissionTypeAPIKey                = "APIKEY"
	PermissionTypeIngress               = "INGRESS"
	PermissionTypeHPA                   = "HPA"
	PermissionBlank                     = "_"
)

type permissionModel struct{}

type Permission struct {
	Id      int64  `orm:"auto" json:"id,omitempty"`
	Name    string `orm:"index;size(200)" json:"name,omitempty"`
	Comment string `orm:"type(text)" json:"comment,omitempty"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`

	Groups []*Group `orm:"reverse(many)" json:"groups,omitempty"`
}

type TypePermission struct {
	PermissionTypeApp                   ActionPermission `json:"app" mapstructure:"APP"`
	PermissionTypeAppUser               ActionPermission `json:"appUser" mapstructure:"APPUSER"`
	PermissionTypeNamespace             ActionPermission `json:"namespace" mapstructure:"NAMESPACE"`
	PermissionTypeNamespaceUser         ActionPermission `json:"namespaceUser" mapstructure:"NAMESPACEUSER"`
	PermissionTypeDeployment            ActionPermission `json:"deployment" mapstructure:"DEPLOYMENT"`
	PermissionTypeSecret                ActionPermission `json:"secret" mapstructure:"SECRET"`
	PermissionTypeService               ActionPermission `json:"service" mapstructure:"SERVICE"`
	PermissionTypeConfigMap             ActionPermission `json:"configmap" mapstructure:"CONFIGMAP"`
	PermissionTypeCronjob               ActionPermission `json:"cronjob" mapstructure:"CRONJOB"`
	PermissionTypePersistentVolumeClaim ActionPermission `json:"pvc" mapstructure:"PVC"`
	PermissionTypeWebHook               ActionPermission `json:"webHook" mapstructure:"WEBHOOK"`
	PermissionTypeApiKey                ActionPermission `json:"apiKey" mapstructure:"APIKEY"`
	PermissionTypeStatefulset           ActionPermission `json:"statefulset" mapstructure:"STATEFULSET"`
	PermissionTypeDaemonSet             ActionPermission `json:"daemonSet" mapstructure:"DAEMONSET"`
	PermissionTypeBILL                  ActionPermission `json:"bill" mapstructure:"BILL"`
	PermissionIngress                   ActionPermission `json:"ingress" mapstructure:"INGRESS"`
}

type ActionPermission struct {
	PermissionRead    bool `json:"read" mapstructure:"READ"`
	PermissionCreate  bool `json:"create" mapstructure:"CREATE"`
	PermissionUpdate  bool `json:"update" mapstructure:"UPDATE"`
	PermissionDelete  bool `json:"delete" mapstructure:"DELETE"`
	PermissionDeploy  bool `json:"deploy" mapstructure:"DEPLOY"`
	PermissionOffline bool `json:"offline" mapstructure:"OFFLINE"`
}

func (*Permission) TableName() string {
	return TableNamePermission
}

func (*permissionModel) Add(m *Permission) (id int64, err error) {
	m.CreateTime = nil
	id, err = Ormer().Insert(m)
	return
}

func (*permissionModel) GetById(id int64) (v *Permission, err error) {
	v = &Permission{Id: id}
	if err = Ormer().Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

func (*permissionModel) UpdateById(m *Permission) (err error) {
	v := Permission{Id: m.Id}
	if err = Ormer().Read(&v); err == nil {
		m.UpdateTime = nil
		var num int64
		if num, err = Ormer().Update(m); err == nil {
			fmt.Println("Number of records updated in database:", num)
		}
	}
	return
}

func (*permissionModel) Delete(id int64) (err error) {
	v := Permission{Id: id}
	if err = Ormer().Read(&v); err == nil {
		var num int64
		if num, err = Ormer().Delete(&Permission{Id: id}); err == nil {
			fmt.Println("Number of records deleted in database:", num)
		}
	}
	return
}

// 解析Name为action与type
func (*permissionModel) SplitName(name string) (paction string, ptype string, err error) {
	stringSlice := strings.Split(name, PermissionBlank)
	if len(stringSlice) < 2 {
		err = errors.New("Permission name split fail")
		return "", "", err
	}
	ptype = stringSlice[0]
	paction = stringSlice[1]
	return
}

/*
 * 合并permission的type和action
 */
func (*permissionModel) MergeName(perType string, perAction string) (perName string) {
	perName = perType + PermissionBlank + perAction
	return perName
}

/*
 * 根据publishType获取权限类别
 */
func (*permissionModel) GetPermissionTypeByPublishType(pType PublishType) (perType string) {
	perType = ""
	switch pType {
	case PublishTypeDeployment:
		perType = PermissionTypeDeployment
	case PublishTypeService:
		perType = PermissionTypeService
	case PublishTypeConfigMap:
		perType = PermissionTypeConfigMap
	case PublishTypeSecret:
		perType = PermissionTypeSecret
	case PublishTypePersistentVolumeClaim:
		perType = PermissionTypePersistentVolumeClaim
	case PublishTypeCronJob:
		perType = PermissionTypeCronjob
	case PublishTypeIngress:
		perType = PermissionTypeIngress
	}
	return perType
}
