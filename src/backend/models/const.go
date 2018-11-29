package models

type KubeApiType string

const (
	KubeApiTypeDeployment            KubeApiType = "Deployment"
	KubeApiTypeCronJob               KubeApiType = "CronJob"
	KubeApiTypeStatefulSet           KubeApiType = "StatefulSet"
	KubeApiTypeDaemonSet             KubeApiType = "DaemonSet"
	KubeApiTypeService               KubeApiType = "Service"
	KubeApiTypeConfigMap             KubeApiType = "ConfigMap"
	KubeApiTypeSecret                KubeApiType = "Secret"
	KubeApiTypePersistentVolumeClaim KubeApiType = "PersistentVolumeClaim"
	KubeApiTypeJob                   KubeApiType = "Job"
	KubeApiTypeReplicaSet            KubeApiType = "ReplicaSet"
)

var TableToKubeApiTypeMap = map[string]KubeApiType{
	TableNameDeployment:            KubeApiTypeDeployment,
	TableNameCronjob:               KubeApiTypeCronJob,
	TableNameStatefulset:           KubeApiTypeStatefulSet,
	TableNameDaemonSet:             KubeApiTypeDaemonSet,
	TableNameService:               KubeApiTypeService,
	TableNameConfigMap:             KubeApiTypeConfigMap,
	TableNameSecret:                KubeApiTypeSecret,
	TableNamePersistentVolumeClaim: KubeApiTypePersistentVolumeClaim,
}

const ListFilterExprSep = "__"
