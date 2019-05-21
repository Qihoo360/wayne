package statefulset

import (
	"k8s.io/api/apps/v1beta1"
	"k8s.io/apimachinery/pkg/api/errors"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/client/api"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/event"
	"github.com/Qihoo360/wayne/src/backend/resources/pod"
	"github.com/Qihoo360/wayne/src/backend/util/maps"
)

type Statefulset struct {
	ObjectMeta common.ObjectMeta `json:"objectMeta"`
	Pods       common.PodInfo    `json:"pods"`
}

// GetStatefulsetResource get StatefulSet resource statistics
func GetStatefulsetResource(cli client.ResourceHandler, statefulSet *v1beta1.StatefulSet) (*common.ResourceList, error) {
	obj, err := cli.Get(api.ResourceNameStatefulSet, statefulSet.Namespace, statefulSet.Name)
	if err != nil {
		if errors.IsNotFound(err) {
			return common.StatefulsetResourceList(statefulSet), nil
		}
		return nil, err
	}
	old := obj.(*v1beta1.StatefulSet)
	oldResourceList := common.StatefulsetResourceList(old)
	newResourceList := common.StatefulsetResourceList(statefulSet)

	return &common.ResourceList{
		Cpu:    newResourceList.Cpu - oldResourceList.Cpu,
		Memory: newResourceList.Memory - oldResourceList.Memory,
	}, nil
}

func CreateOrUpdateStatefulset(cli *kubernetes.Clientset, statefulSet *v1beta1.StatefulSet) (*v1beta1.StatefulSet, error) {
	old, err := cli.AppsV1beta1().StatefulSets(statefulSet.Namespace).Get(statefulSet.Name, metaV1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return cli.AppsV1beta1().StatefulSets(statefulSet.Namespace).Create(statefulSet)
		}
		return nil, err
	}
	old.Labels = maps.MergeLabels(old.Labels, statefulSet.Labels)
	oldTemplateLabels := old.Spec.Template.Labels
	old.Spec = statefulSet.Spec
	old.Spec.Template.Labels = maps.MergeLabels(oldTemplateLabels, statefulSet.Spec.Template.Labels)

	return cli.AppsV1beta1().StatefulSets(statefulSet.Namespace).Update(old)
}

func GetStatefulsetDetail(cli *kubernetes.Clientset, indexer *client.CacheFactory, name, namespace string) (*Statefulset, error) {
	statefulSet, err := cli.AppsV1beta1().StatefulSets(namespace).Get(name, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}

	result := &Statefulset{
		ObjectMeta: common.NewObjectMeta(statefulSet.ObjectMeta),
	}

	podInfo := common.PodInfo{}
	podInfo.Current = statefulSet.Status.ReadyReplicas
	podInfo.Desired = *statefulSet.Spec.Replicas

	pods, err := pod.ListKubePod(indexer, namespace, statefulSet.Spec.Template.Labels)
	if err != nil {
		return nil, err
	}

	podInfo.Warnings, err = event.GetPodsWarningEvents(indexer, pods)
	if err != nil {
		return nil, err
	}

	result.Pods = podInfo

	return result, nil
}
