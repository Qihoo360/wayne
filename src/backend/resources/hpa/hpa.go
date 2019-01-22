package hpa

import (
	"github.com/Qihoo360/wayne/src/backend/client"

	autoscaling "k8s.io/api/autoscaling/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/kubernetes"
)

func GetHPAList(indexer *client.CacheFactory, namespace string, label map[string]string) ([]*autoscaling.HorizontalPodAutoscaler, error) {
	hpas, err := indexer.HPALister().HorizontalPodAutoscalers(namespace).List(labels.SelectorFromSet(label))
	if err != nil {
		return nil, err
	}
	return hpas, nil
}

func GetHPADetail(indexer *client.CacheFactory, name, namespace string) (*HPA, error) {
	hpa, err := indexer.HPALister().HorizontalPodAutoscalers(namespace).Get(name)
	if err != nil {
		return nil, err
	}
	return toHPA(hpa), nil
}

func GetHPA(indexer *client.CacheFactory, name, namespace string) (hpa *autoscaling.HorizontalPodAutoscaler, err error) {
	hpa, err = indexer.HPALister().HorizontalPodAutoscalers(namespace).Get(name)
	if err != nil {
		return nil, err
	}
	return
}

func CreateOrUpdateHPA(c *kubernetes.Clientset, hpa *autoscaling.HorizontalPodAutoscaler) (*HPA, error) {
	old, err := c.AutoscalingV1().HorizontalPodAutoscalers(hpa.Namespace).Get(hpa.Name, v1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			kubeHPA, err := c.AutoscalingV1().HorizontalPodAutoscalers(hpa.Namespace).Create(hpa)
			if err != nil {
				return nil, err
			}
			return toHPA(kubeHPA), nil
		}
		return nil, err
	}
	hpa.Spec.DeepCopyInto(&old.Spec)
	kubeHPA, err := c.AutoscalingV1().HorizontalPodAutoscalers(hpa.Namespace).Update(old)
	if err != nil {
		return nil, err
	}
	return toHPA(kubeHPA), nil
}

func DeleteHPA(c *kubernetes.Clientset, name, namespace string) error {
	return c.AutoscalingV1().HorizontalPodAutoscalers(namespace).Delete(name, &v1.DeleteOptions{})
}
