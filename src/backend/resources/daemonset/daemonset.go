package daemonset

import (
	"k8s.io/api/extensions/v1beta1"
	"k8s.io/apimachinery/pkg/api/errors"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/event"
	"github.com/Qihoo360/wayne/src/backend/resources/pod"
	"github.com/Qihoo360/wayne/src/backend/util/maps"
)

type DaemonSet struct {
	ObjectMeta common.ObjectMeta `json:"objectMeta"`
	Pods       common.PodInfo    `json:"pods"`
}

func CreateOrUpdateDaemonSet(cli *kubernetes.Clientset, daemonSet *v1beta1.DaemonSet) (*v1beta1.DaemonSet, error) {
	old, err := cli.ExtensionsV1beta1().DaemonSets(daemonSet.Namespace).Get(daemonSet.Name, metaV1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return cli.ExtensionsV1beta1().DaemonSets(daemonSet.Namespace).Create(daemonSet)
		}
		return nil, err
	}
	old.Labels = maps.MergeLabels(old.Labels, daemonSet.Labels)
	oldTemplateLabels := old.Spec.Template.Labels
	old.Spec = daemonSet.Spec
	old.Spec.Template.Labels = maps.MergeLabels(oldTemplateLabels, daemonSet.Spec.Template.Labels)

	return cli.ExtensionsV1beta1().DaemonSets(daemonSet.Namespace).Update(old)
}

func GetDaemonSetDetail(cli *kubernetes.Clientset, indexer *client.CacheFactory, name, namespace string) (*DaemonSet, error) {
	daemonSet, err := cli.ExtensionsV1beta1().DaemonSets(namespace).Get(name, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}

	result := &DaemonSet{
		ObjectMeta: common.NewObjectMeta(daemonSet.ObjectMeta),
	}

	podInfo := common.PodInfo{}
	podInfo.Current = daemonSet.Status.NumberAvailable
	podInfo.Desired = daemonSet.Status.DesiredNumberScheduled

	pods, err := pod.ListKubePod(indexer, namespace, daemonSet.Spec.Template.Labels)
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

func DeleteDaemonSet(cli *kubernetes.Clientset, name, namespace string) error {
	deletionPropagation := metaV1.DeletePropagationBackground
	return cli.ExtensionsV1beta1().
		DaemonSets(namespace).
		Delete(name, &metaV1.DeleteOptions{PropagationPolicy: &deletionPropagation})
}
