package common

import (
	"k8s.io/api/apps/v1beta1"
	"k8s.io/api/core/v1"
)

func DeploymentResourceList(deployment *v1beta1.Deployment) *ResourceList {
	replicas := *(deployment.Spec.Replicas)
	resourceList := ContainersResourceList(deployment.Spec.Template.Spec.Containers)
	return &ResourceList{
		Cpu:    resourceList.Cpu * int64(replicas),
		Memory: resourceList.Memory * int64(replicas),
	}
}

func StatefulsetResourceList(statefulSet *v1beta1.StatefulSet) *ResourceList {
	replicas := *(statefulSet.Spec.Replicas)
	resourceList := ContainersResourceList(statefulSet.Spec.Template.Spec.Containers)
	return &ResourceList{
		Cpu:    resourceList.Cpu * int64(replicas),
		Memory: resourceList.Memory * int64(replicas),
	}
}

func ContainersResourceList(containers []v1.Container) *ResourceList {
	var cpuUsage, memoryUsage int64
	for _, container := range containers {
		// unit m
		cpuUsage += container.Resources.Limits.Cpu().MilliValue()
		// unit Byte
		memoryUsage += container.Resources.Limits.Memory().Value()
	}
	return &ResourceList{
		Cpu:    cpuUsage,
		Memory: memoryUsage,
	}
}

func ContainersRequestResourceList(containers []v1.Container) *ResourceList {
	var cpuUsage, memoryUsage int64
	for _, container := range containers {
		// unit m
		cpuUsage += container.Resources.Requests.Cpu().MilliValue()
		// unit Byte
		memoryUsage += container.Resources.Requests.Memory().Value()
	}
	return &ResourceList{
		Cpu:    cpuUsage,
		Memory: memoryUsage,
	}
}

func CompareLabels(source map[string]string, target map[string]string) bool {
	if len(source) != len(target) {
		return false
	}
	for key, value := range source {
		targetValue, ok := target[key]
		if !ok || value != targetValue {
			return false
		}
	}
	return true
}
