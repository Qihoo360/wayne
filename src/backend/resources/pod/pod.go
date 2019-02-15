package pod

import (
	"time"

	"k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/models"
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

func ListPod(indexer *client.CacheFactory, namespace string, label map[string]string) ([]*Pod, error) {
	podList, err := ListKubePod(indexer, namespace, label)
	if err != nil {
		return nil, err
	}
	pods := make([]*Pod, 0)
	for _, pod := range podList {
		pods = append(pods, &Pod{
			Labels: pod.Labels,
			PodIp:  pod.Status.PodIP,
		})
	}
	return pods, nil
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

func GetPodsByStatefulset(indexer *client.CacheFactory, namespace, name string) ([]*Pod, error) {
	podSelector := map[string]string{"app": name}
	pods, err := ListKubePod(indexer, namespace, podSelector)
	if err != nil {
		return nil, err
	}
	filteredPod := filterPodByApiType(pods, models.KubeApiTypeStatefulSet)
	return toPods(filteredPod), nil
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

func GetPodsByDaemonSet(indexer *client.CacheFactory, namespace, name string) ([]*Pod, error) {
	podSelector := map[string]string{"app": name}
	pods, err := ListKubePod(indexer, namespace, podSelector)
	if err != nil {
		return nil, err
	}
	filteredPod := filterPodByApiType(pods, models.KubeApiTypeDaemonSet)

	return toPods(filteredPod), nil
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

func GetPodsByJob(indexer *client.CacheFactory, namespace, name string) ([]*Pod, error) {
	podSelector := map[string]string{"job-name": name}
	pods, err := ListKubePod(indexer, namespace, podSelector)
	if err != nil {
		return nil, err
	}

	return toPods(pods), nil
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
