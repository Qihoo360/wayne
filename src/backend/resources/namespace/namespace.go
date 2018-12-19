package namespace

import (
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/util"
	"k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func UpdateNamespace(cli *kubernetes.Clientset, ns *v1.Namespace) (*v1.Namespace, error) {
	newNS, err := cli.CoreV1().Namespaces().Update(ns)
	if err != nil {
		return nil, err
	}
	return newNS, nil
}

func CreateNotExitNamespace(cli *kubernetes.Clientset, ns *v1.Namespace) (*v1.Namespace, error) {
	_, err := cli.CoreV1().Namespaces().Get(ns.Name, metaV1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return cli.CoreV1().Namespaces().Create(ns)
		}
		return nil, err
	}
	return nil, nil
}

func ResourcesUsageByNamespace(cli *kubernetes.Clientset, namespace, selector string) (*common.ResourceList, error) {
	podList, err := cli.CoreV1().Pods(namespace).List(metaV1.ListOptions{
		LabelSelector: selector,
	})
	if err != nil {
		return nil, err
	}
	var cpuUsage, memoryUsage int64
	for _, pod := range podList.Items {
		resourceList := common.ContainersResourceList(pod.Spec.Containers)
		cpuUsage += resourceList.Cpu
		memoryUsage += resourceList.Memory
	}
	return &common.ResourceList{
		Cpu:    cpuUsage,
		Memory: memoryUsage,
	}, nil
}

func ResourcesOfAppByNamespace(cli *kubernetes.Clientset, namespace, selector string) (map[string]*common.ResourceApp, error) {
	podList, err := cli.CoreV1().Pods(namespace).List(metaV1.ListOptions{
		LabelSelector: selector,
	})
	if err != nil {
		return nil, err
	}
	result := make(map[string]*common.ResourceApp)
	for _, pod := range podList.Items {
		resourceList := common.ContainersResourceList(pod.Spec.Containers)
		if result[pod.Labels[util.AppLabelKey]] == nil {
			result[pod.Labels[util.AppLabelKey]] = &common.ResourceApp{
				Cpu:    resourceList.Cpu / 1000,
				Memory: resourceList.Memory / 1024,
				PodNum: 1,
			}
		} else {
			result[pod.Labels[util.AppLabelKey]].Cpu += resourceList.Cpu / 1000
			result[pod.Labels[util.AppLabelKey]].Memory += resourceList.Memory / 1024
			result[pod.Labels[util.AppLabelKey]].PodNum += 1
		}
	}
	return result, nil
}
