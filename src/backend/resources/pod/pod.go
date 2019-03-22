package pod

import (
	"fmt"
	"sort"
	"time"

	"k8s.io/api/core/v1"
	extensionsv1beta1 "k8s.io/api/extensions/v1beta1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/client/api"
	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
	"github.com/Qihoo360/wayne/src/backend/util/slice"
)

type PodStatistics struct {
	Total   int            `json:"total,omitempty"`
	Details map[string]int `json:"details,omitempty"`
}

type Pod struct {
	Name            string            `json:"name,omitempty"`
	Namespace       string            `json:"namespace,omitempty"`
	ContainerStatus []ContainerStatus `json:"containerStatus,omitempty"`
	State           string            `json:"state,omitempty"`
	PodIp           string            `json:"podIp,omitempty"`
	NodeName        string            `json:"nodeName,omitempty"`
	StartTime       time.Time         `json:"startTime,omitempty"`
	Labels          map[string]string `json:"labels,omitempty"`
}

type ContainerStatus struct {
	Name         string `json:"name,omitempty"`
	RestartCount int32  `json:"restartCount"`
}

func GetPodCounts(indexer *client.CacheFactory) (int, error) {
	pods, err := indexer.PodLister().List(labels.Everything())
	if err != nil {
		return 0, err
	}
	length := 0
	for _, pod := range pods {
		if pod.Status.Phase == v1.PodFailed || pod.Status.Phase == v1.PodSucceeded {
			continue
		}
		length++
	}
	return length, nil
}

func ListKubePod(indexer *client.CacheFactory, namespace string, label map[string]string) ([]*v1.Pod, error) {
	pods, err := indexer.PodLister().Pods(namespace).List(labels.SelectorFromSet(label))
	if err != nil {
		return nil, err
	}
	return pods, nil
}

func ListPodByLabelKey(indexer *client.CacheFactory, namespace string, label string) ([]*Pod, error) {
	podSelector := map[string]string{}
	podList, err := ListKubePod(indexer, namespace, podSelector)
	if err != nil {
		return nil, err
	}
	pods := make([]*Pod, 0)
	for _, pod := range podList {
		if pod.Labels[label] != "" {
			pods = append(pods, &Pod{
				Labels: pod.Labels,
				PodIp:  pod.Status.PodIP,
			})
		}
	}
	return pods, nil
}

func filterPodByApiType(pods []*v1.Pod, apiType models.KubeApiType) []*v1.Pod {
	filteredPod := make([]*v1.Pod, 0)
	for _, kpod := range pods {
		for _, owner := range kpod.OwnerReferences {
			if owner.Kind == string(apiType) {
				filteredPod = append(filteredPod, kpod)
				break
			}

		}
	}
	return filteredPod
}

func GetPodsByDeploymentPage(kubeClient client.ResourceHandler, namespace, name string, q *common.QueryParam) (*common.Page, error) {
	rss, err := kubeClient.List(api.ResourceNameReplicaSet, namespace, labels.Everything().String())
	if err != nil {
		return nil, err
	}
	relateRs := make([]string, 0)
	for _, obj := range rss {
		rs, ok := obj.(*extensionsv1beta1.ReplicaSet)
		if !ok {
			return nil, fmt.Errorf("Convert rs obj (%v) error. ", obj)
		}
		for _, ref := range rs.OwnerReferences {
			if ref.Kind == api.KindNameDeployment && ref.Name == name {
				relateRs = append(relateRs, rs.Name)
			}
		}

	}
	pods, err := kubeClient.List(api.ResourceNamePod, namespace, labels.Everything().String())
	if err != nil {
		return nil, err
	}
	relatePod := make([]*v1.Pod, 0)
	for _, obj := range pods {
		pod, ok := obj.(*v1.Pod)
		if !ok {
			return nil, fmt.Errorf("Convert pod obj (%v) error. ", obj)
		}
		for _, ref := range pod.OwnerReferences {
			if ref.Kind == api.KindNameReplicaSet && slice.StrSliceContains(relateRs, ref.Name) {
				relatePod = append(relatePod, pod)
			}
		}

	}
	return pageResult(relatePod, q), nil
}

func GetPodPage(kubeClient client.ResourceHandler, namespace, resourceName string, q *common.QueryParam) (*common.Page, error) {
	obj, err := kubeClient.Get(api.ResourceNamePod, namespace, resourceName)
	if err != nil {
		return nil, err
	}
	pod, ok := obj.(*v1.Pod)
	if !ok {
		return nil, fmt.Errorf("Convert pod obj (%v) error. ", obj)
	}
	relatePod := []*v1.Pod{
		pod,
	}
	return pageResult(relatePod, q), nil
}

func GetRelatedPodByType(kubeClient client.ResourceHandler, namespace, resourceName string, resourceType api.ResourceName, q *common.QueryParam) (*common.Page, error) {
	var objs = make([]runtime.Object, 0)
	var err error
	objs, err = kubeClient.List(api.ResourceNamePod, namespace, labels.Everything().String())
	if err != nil {
		return nil, err
	}

	relatePod := make([]*v1.Pod, 0)
	for _, obj := range objs {
		pod, ok := obj.(*v1.Pod)
		if !ok {
			return nil, fmt.Errorf("Convert pod obj (%v) error. ", obj)
		}
		for _, ref := range pod.OwnerReferences {
			groupVersionResourceKind, ok := api.KindToResourceMap[resourceType]
			if !ok {
				continue
			}
			if ref.Kind == groupVersionResourceKind.GroupVersionResourceKind.Kind && resourceName == ref.Name {
				relatePod = append(relatePod, pod)
			}
		}

	}
	return pageResult(relatePod, q), nil
}

func pageResult(relatePod []*v1.Pod, q *common.QueryParam) *common.Page {
	commonObjs := make([]dataselector.DataCell, 0)
	for _, pod := range relatePod {
		commonObjs = append(commonObjs, ObjectCell(*pod))
	}

	sort.Slice(commonObjs, func(i, j int) bool {
		return commonObjs[j].GetProperty(dataselector.NameProperty).
			Compare(commonObjs[i].GetProperty(dataselector.NameProperty)) == -1
	})

	return dataselector.DataSelectPage(commonObjs, q)
}

func GetPodsByDeployment(indexer *client.CacheFactory, namespace, name string) ([]*Pod, error) {
	podSelector := map[string]string{"app": name}
	pods, err := ListKubePod(indexer, namespace, podSelector)
	if err != nil {
		return nil, err
	}
	filteredPod := filterPodByApiType(pods, models.KubeApiTypeReplicaSet)

	return toPods(filteredPod), nil
}

func GetPodByName(cli *kubernetes.Clientset, namespace, name string) (*Pod, error) {
	kpod, err := cli.CoreV1().Pods(namespace).Get(name, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return toPod(kpod), nil
}

func DeletePod(cli *kubernetes.Clientset, name, namespace string) error {
	return cli.CoreV1().
		Pods(namespace).
		Delete(name, &metaV1.DeleteOptions{})
}

func toPods(pods []*v1.Pod) []*Pod {
	result := make([]*Pod, 0)
	for _, kpod := range pods {
		result = append(result, toPod(kpod))
	}

	return result
}

func toPod(kpod *v1.Pod) *Pod {
	pod := Pod{
		Name:      kpod.Name,
		Namespace: kpod.Namespace,
		PodIp:     kpod.Status.PodIP,
		NodeName:  kpod.Spec.NodeName,
		State:     getPodStatus(kpod),
	}

	pod.StartTime = kpod.CreationTimestamp.Time

	status := make([]ContainerStatus, 0)

	for _, containerStatuse := range kpod.Status.ContainerStatuses {
		state := ContainerStatus{
			Name:         containerStatuse.Name,
			RestartCount: containerStatuse.RestartCount,
		}

		status = append(status, state)
	}

	pod.ContainerStatus = status

	return &pod
}

// getPodStatus returns the pod state
func getPodStatus(pod *v1.Pod) string {
	// Terminating
	if pod.DeletionTimestamp != nil {
		return "Terminating"
	}

	// not running
	if pod.Status.Phase != v1.PodRunning {
		return string(pod.Status.Phase)
	}

	ready := false
	notReadyReason := ""
	for _, c := range pod.Status.Conditions {
		if c.Type == v1.PodReady {
			ready = c.Status == v1.ConditionTrue
			notReadyReason = c.Reason
		}
	}

	if pod.Status.Reason != "" {
		return pod.Status.Reason
	}

	if notReadyReason != "" {
		return notReadyReason
	}

	if ready {
		return string(v1.PodRunning)
	}

	// Unknown?
	return "Unknown"
}
