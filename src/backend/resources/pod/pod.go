package pod

import (
	"time"

	"k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
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

func GetPodCounts(indexer *client.CacheIndexer) int {
	cachePods := indexer.Pod.List()
	var pods []v1.Pod
	for _, e := range cachePods {
		cachePod, ok := e.(*v1.Pod)
		if !ok {
			continue
		}
		if cachePod.Status.Phase == v1.PodFailed || cachePod.Status.Phase == v1.PodSucceeded {
			continue
		}
		pods = append(pods, *cachePod)
	}
	return len(pods)
}

func GetPodsBySelectorFromCache(indexer *client.CacheIndexer, namespace string, labels map[string]string) []v1.Pod {
	cachePods := indexer.Pod.List()
	var pods []v1.Pod
	for _, pod := range cachePods {
		cachePod, ok := pod.(*v1.Pod)
		if !ok {
			continue
		}
		if namespace != "" && namespace != cachePod.Namespace {
			continue
		}

		if labels != nil && !common.CompareLabels(labels, cachePod.Labels) {
			continue
		}

		pods = append(pods, *cachePod)
	}

	return pods
}

func GetAllPodByLabelSelector(cli *kubernetes.Clientset, labelSelector string) ([]*Pod, error) {
	podList, err := cli.CoreV1().Pods(metaV1.NamespaceAll).List(metaV1.ListOptions{LabelSelector: labelSelector})
	if err != nil {
		return nil, err
	}
	pods := make([]*Pod, 0)
	for _, pod := range podList.Items {
		pods = append(pods, &Pod{
			Labels: pod.Labels,
			PodIp:  pod.Status.PodIP,
		})
	}
	return pods, nil
}

func GetPodsBySelector(cli *kubernetes.Clientset, namespace, labelSelector string) ([]v1.Pod, error) {
	podList, err := cli.CoreV1().Pods(namespace).List(metaV1.ListOptions{LabelSelector: labelSelector})
	if err != nil {
		return nil, err
	}
	return podList.Items, nil
}

func GetPodsByStatefulset(cli *kubernetes.Clientset, namespace, name string) ([]*Pod, error) {
	podSelector := labels.SelectorFromSet(map[string]string{"app": name}).String()
	pods, err := GetPodsBySelector(cli, namespace, podSelector)
	if err != nil {
		return nil, err
	}
	filteredPod := filterPodByApiType(pods, models.KubeApiTypeStatefulSet)
	return toPods(filteredPod), nil
}

func filterPodByApiType(pods []v1.Pod, apiType models.KubeApiType) []v1.Pod {
	filteredPod := make([]v1.Pod, 0)
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

func GetPodsByDaemonSet(cli *kubernetes.Clientset, namespace, name string) ([]*Pod, error) {
	podSelector := labels.SelectorFromSet(map[string]string{"app": name}).String()
	pods, err := GetPodsBySelector(cli, namespace, podSelector)
	if err != nil {
		return nil, err
	}
	filteredPod := filterPodByApiType(pods, models.KubeApiTypeDaemonSet)

	return toPods(filteredPod), nil
}

func GetPodsByDeployment(cli *kubernetes.Clientset, namespace, name string) ([]*Pod, error) {
	podSelector := labels.SelectorFromSet(map[string]string{"app": name}).String()
	pods, err := GetPodsBySelector(cli, namespace, podSelector)
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

func toPods(pods []v1.Pod) []*Pod {
	result := make([]*Pod, 0)
	for _, kpod := range pods {
		result = append(result, toPod(&kpod))
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

	if kpod.Status.StartTime != nil {
		pod.StartTime = kpod.Status.StartTime.Local()
	}

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

func GetPodsByJob(cli *kubernetes.Clientset, namespace, name string) ([]*Pod, error) {
	podSelector := labels.SelectorFromSet(map[string]string{"job-name": name}).String()
	pods, err := GetPodsBySelector(cli, namespace, podSelector)
	if err != nil {
		return nil, err
	}

	return toPods(pods), nil
}
