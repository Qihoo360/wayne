package api

import (
	appsv1beta1 "k8s.io/api/apps/v1beta1"
	autoscalingv1 "k8s.io/api/autoscaling/v1"
	batchv1 "k8s.io/api/batch/v1"
	batchv1beta1 "k8s.io/api/batch/v1beta1"
	corev1 "k8s.io/api/core/v1"
	extensionsv1beta1 "k8s.io/api/extensions/v1beta1"
	rbacv1 "k8s.io/api/rbac/v1"
	storagev1 "k8s.io/api/storage/v1"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

type ResourceName = string
type KindName = string

const (
	ResourceNameConfigMap               ResourceName = "configmaps"
	ResourceNameDaemonSet               ResourceName = "daemonsets"
	ResourceNameDeployment              ResourceName = "deployments"
	ResourceNameEvent                   ResourceName = "events"
	ResourceNameHorizontalPodAutoscaler ResourceName = "horizontalpodautoscalers"
	ResourceNameIngress                 ResourceName = "ingresses"
	ResourceNameJob                     ResourceName = "jobs"
	ResourceNameCronJob                 ResourceName = "cronjobs"
	ResourceNameNamespace               ResourceName = "namespaces"
	ResourceNameNode                    ResourceName = "nodes"
	ResourceNamePersistentVolumeClaim   ResourceName = "persistentvolumeclaims"
	ResourceNamePersistentVolume        ResourceName = "persistentvolumes"
	ResourceNamePod                     ResourceName = "pods"
	ResourceNameReplicaSet              ResourceName = "replicasets"
	ResourceNameSecret                  ResourceName = "secrets"
	ResourceNameService                 ResourceName = "services"
	ResourceNameStatefulSet             ResourceName = "statefulsets"
	ResourceNameEndpoint                ResourceName = "endpoints"
	ResourceNameStorageClass            ResourceName = "storageclasses"
	ResourceNameRole                    ResourceName = "roles"
	ResourceNameRoleBinding             ResourceName = "rolebindings"
	ResourceNameClusterRole             ResourceName = "clusterroles"
	ResourceNameClusterRoleBinding      ResourceName = "clusterrolebindings"
	ResourceNameServiceAccount          ResourceName = "serviceaccounts"
)

const (
	KindNameConfigMap               KindName = "ConfigMap"
	KindNameDaemonSet               KindName = "DaemonSet"
	KindNameDeployment              KindName = "Deployment"
	KindNameEvent                   KindName = "Event"
	KindNameHorizontalPodAutoscaler KindName = "HorizontalPodAutoscaler"
	KindNameIngress                 KindName = "Ingress"
	KindNameJob                     KindName = "Job"
	KindNameCronJob                 KindName = "CronJob"
	KindNameNamespace               KindName = "Namespace"
	KindNameNode                    KindName = "Node"
	KindNamePersistentVolumeClaim   KindName = "PersistentVolumeClaim"
	KindNamePersistentVolume        KindName = "PersistentVolume"
	KindNamePod                     KindName = "Pod"
	KindNameReplicaSet              KindName = "ReplicaSet"
	KindNameSecret                  KindName = "Secret"
	KindNameService                 KindName = "Service"
	KindNameStatefulSet             KindName = "StatefulSet"
	KindNameEndpoint                KindName = "Endpoints"
	KindNameStorageClass            KindName = "StorageClass"
	KindNameRole                    KindName = "Role"
	KindNameRoleBinding             KindName = "RoleBinding"
	KindNameClusterRole             KindName = "ClusterRole"
	KindNameClusterRoleBinding      KindName = "ClusterRoleBinding"
	KindNameServiceAccount          KindName = "ServiceAccount"
)

type ResourceMap struct {
	GroupVersionResourceKind GroupVersionResourceKind
	Namespaced               bool
}

type GroupVersionResourceKind struct {
	schema.GroupVersionResource
	Kind string
}

var KindToResourceMap = map[string]ResourceMap{
	ResourceNameConfigMap: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNameConfigMap,
			},
			Kind: KindNameConfigMap,
		},
		Namespaced: true,
	},
	ResourceNameDaemonSet: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    extensionsv1beta1.GroupName,
				Version:  extensionsv1beta1.SchemeGroupVersion.Version,
				Resource: ResourceNameDaemonSet,
			},
			Kind: KindNameDaemonSet,
		},
		Namespaced: true,
	},
	ResourceNameDeployment: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    appsv1beta1.GroupName,
				Version:  appsv1beta1.SchemeGroupVersion.Version,
				Resource: ResourceNameDeployment,
			},
			Kind: KindNameDeployment,
		},
		Namespaced: true,
	},
	ResourceNameEvent: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNameEvent,
			},
			Kind: KindNameEvent,
		},
		Namespaced: true,
	},

	ResourceNameHorizontalPodAutoscaler: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    autoscalingv1.GroupName,
				Version:  autoscalingv1.SchemeGroupVersion.Version,
				Resource: ResourceNameHorizontalPodAutoscaler,
			},
			Kind: KindNameHorizontalPodAutoscaler,
		},
		Namespaced: true,
	},
	ResourceNameIngress: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    extensionsv1beta1.GroupName,
				Version:  extensionsv1beta1.SchemeGroupVersion.Version,
				Resource: ResourceNameIngress,
			},
			Kind: KindNameIngress,
		},
		Namespaced: true,
	},
	ResourceNameJob: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    batchv1.GroupName,
				Version:  batchv1.SchemeGroupVersion.Version,
				Resource: ResourceNameJob,
			},
			Kind: KindNameJob,
		},
		Namespaced: true,
	},
	ResourceNameCronJob: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    batchv1beta1.GroupName,
				Version:  batchv1beta1.SchemeGroupVersion.Version,
				Resource: ResourceNameCronJob,
			},
			Kind: KindNameCronJob,
		},
		Namespaced: true,
	},
	ResourceNameNamespace: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNameNamespace,
			},
			Kind: KindNameNamespace,
		},
		Namespaced: false,
	},
	ResourceNameNode: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNameNode,
			},
			Kind: KindNameNode,
		},
		Namespaced: false,
	},
	ResourceNamePersistentVolumeClaim: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNamePersistentVolumeClaim,
			},
			Kind: KindNamePersistentVolumeClaim,
		},
		Namespaced: true,
	},
	ResourceNamePersistentVolume: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNamePersistentVolume,
			},
			Kind: KindNamePersistentVolume,
		},
		Namespaced: false,
	},
	ResourceNamePod: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNamePod,
			},
			Kind: KindNamePod,
		},
		Namespaced: true,
	},
	ResourceNameReplicaSet: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    extensionsv1beta1.GroupName,
				Version:  extensionsv1beta1.SchemeGroupVersion.Version,
				Resource: ResourceNameReplicaSet,
			},
			Kind: KindNameReplicaSet,
		},
		Namespaced: true,
	},
	ResourceNameSecret: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNameSecret,
			},
			Kind: KindNameSecret,
		},
		Namespaced: true,
	},
	ResourceNameService: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNameService,
			},
			Kind: KindNameService,
		},
		Namespaced: true,
	},
	ResourceNameStatefulSet: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    appsv1beta1.GroupName,
				Version:  appsv1beta1.SchemeGroupVersion.Version,
				Resource: ResourceNameStatefulSet,
			},
			Kind: KindNameStatefulSet,
		},
		Namespaced: true,
	},
	ResourceNameEndpoint: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNameEndpoint,
			},
			Kind: KindNameEndpoint,
		},
		Namespaced: true,
	},
	ResourceNameStorageClass: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    storagev1.GroupName,
				Version:  storagev1.SchemeGroupVersion.Version,
				Resource: ResourceNameStorageClass,
			},
			Kind: KindNameStorageClass,
		},
		Namespaced: false,
	},

	ResourceNameRole: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    rbacv1.GroupName,
				Version:  rbacv1.SchemeGroupVersion.Version,
				Resource: ResourceNameRole,
			},
			Kind: KindNameRole,
		},
		Namespaced: true,
	},
	ResourceNameRoleBinding: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    rbacv1.GroupName,
				Version:  rbacv1.SchemeGroupVersion.Version,
				Resource: ResourceNameRoleBinding,
			},
			Kind: KindNameRoleBinding,
		},
		Namespaced: true,
	},
	ResourceNameClusterRole: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    rbacv1.GroupName,
				Version:  rbacv1.SchemeGroupVersion.Version,
				Resource: ResourceNameClusterRole,
			},
			Kind: KindNameClusterRole,
		},
		Namespaced: false,
	},
	ResourceNameClusterRoleBinding: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    rbacv1.GroupName,
				Version:  rbacv1.SchemeGroupVersion.Version,
				Resource: ResourceNameClusterRoleBinding,
			},
			Kind: KindNameClusterRoleBinding,
		},
		Namespaced: false,
	},
	ResourceNameServiceAccount: {
		GroupVersionResourceKind: GroupVersionResourceKind{
			GroupVersionResource: schema.GroupVersionResource{
				Group:    corev1.GroupName,
				Version:  corev1.SchemeGroupVersion.Version,
				Resource: ResourceNameServiceAccount,
			},
			Kind: KindNameServiceAccount,
		},
		Namespaced: true,
	},
}
