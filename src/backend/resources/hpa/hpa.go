package hpa

import (
	autoscaling "k8s.io/api/autoscaling/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

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
