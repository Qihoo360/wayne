package api

import (
	appsv1beta1 "k8s.io/api/apps/v1beta1"
	autoscalingv1 "k8s.io/api/autoscaling/v1"
	batchv1 "k8s.io/api/batch/v1"
	batchv1beta1 "k8s.io/api/batch/v1beta1"
	corev1 "k8s.io/api/core/v1"
	extensionsv1beta1 "k8s.io/api/extensions/v1beta1"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

type ResourceName = string

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
)

type ResourceMap struct {
	GroupVersionResource schema.GroupVersionResource
	Namespaced           bool
}

var KindToResourceMap = map[string]ResourceMap{
	ResourceNameConfigMap: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    corev1.GroupName,
			Version:  corev1.SchemeGroupVersion.Version,
			Resource: ResourceNameConfigMap,
		},
		Namespaced: true,
	},
	ResourceNameDaemonSet: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    extensionsv1beta1.GroupName,
			Version:  extensionsv1beta1.SchemeGroupVersion.Version,
			Resource: ResourceNameDaemonSet,
		},
		Namespaced: true,
	},
	ResourceNameDeployment: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    appsv1beta1.GroupName,
			Version:  appsv1beta1.SchemeGroupVersion.Version,
			Resource: ResourceNameDeployment,
		},
		Namespaced: true,
	},
	ResourceNameEvent: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    corev1.GroupName,
			Version:  corev1.SchemeGroupVersion.Version,
			Resource: ResourceNameEvent,
		},
		Namespaced: true,
	},

	ResourceNameHorizontalPodAutoscaler: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    autoscalingv1.GroupName,
			Version:  autoscalingv1.SchemeGroupVersion.Version,
			Resource: ResourceNameHorizontalPodAutoscaler,
		},
		Namespaced: true,
	},
	ResourceNameIngress: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    extensionsv1beta1.GroupName,
			Version:  extensionsv1beta1.SchemeGroupVersion.Version,
			Resource: ResourceNameIngress,
		},
		Namespaced: true,
	},
	ResourceNameJob: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    batchv1.GroupName,
			Version:  batchv1.SchemeGroupVersion.Version,
			Resource: ResourceNameJob,
		},
		Namespaced: true,
	},
	ResourceNameCronJob: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    batchv1beta1.GroupName,
			Version:  batchv1beta1.SchemeGroupVersion.Version,
			Resource: ResourceNameCronJob,
		},
		Namespaced: true,
	},
	ResourceNameNamespace: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    corev1.GroupName,
			Version:  corev1.SchemeGroupVersion.Version,
			Resource: ResourceNameNamespace,
		},
		Namespaced: false,
	},
	ResourceNameNode: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    corev1.GroupName,
			Version:  corev1.SchemeGroupVersion.Version,
			Resource: ResourceNameNode,
		},
		Namespaced: false,
	},
	ResourceNamePersistentVolumeClaim: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    corev1.GroupName,
			Version:  corev1.SchemeGroupVersion.Version,
			Resource: ResourceNamePersistentVolumeClaim,
		},
		Namespaced: true,
	},
	ResourceNamePersistentVolume: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    corev1.GroupName,
			Version:  corev1.SchemeGroupVersion.Version,
			Resource: ResourceNamePersistentVolume,
		},
		Namespaced: false,
	},
	ResourceNamePod: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    corev1.GroupName,
			Version:  corev1.SchemeGroupVersion.Version,
			Resource: ResourceNamePod,
		},
		Namespaced: true,
	},
	ResourceNameReplicaSet: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    extensionsv1beta1.GroupName,
			Version:  extensionsv1beta1.SchemeGroupVersion.Version,
			Resource: ResourceNameReplicaSet,
		},
		Namespaced: true,
	},
	ResourceNameSecret: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    corev1.GroupName,
			Version:  corev1.SchemeGroupVersion.Version,
			Resource: ResourceNameSecret,
		},
		Namespaced: true,
	},
	ResourceNameService: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    corev1.GroupName,
			Version:  corev1.SchemeGroupVersion.Version,
			Resource: ResourceNameService,
		},
		Namespaced: true,
	},
	ResourceNameStatefulSet: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    appsv1beta1.GroupName,
			Version:  appsv1beta1.SchemeGroupVersion.Version,
			Resource: ResourceNameStatefulSet,
		},
		Namespaced: true,
	},
	ResourceNameEndpoint: {
		GroupVersionResource: schema.GroupVersionResource{
			Group:    corev1.GroupName,
			Version:  corev1.SchemeGroupVersion.Version,
			Resource: ResourceNameEndpoint,
		},
		Namespaced: true,
	},
}
