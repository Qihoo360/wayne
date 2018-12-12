package ingress

import (
	k8sv1beta1 "k8s.io/api/extensions/v1beta1"
	"k8s.io/apimachinery/pkg/api/errors"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func CreateOrUpdateIngress(c *kubernetes.Clientset, ingress *k8sv1beta1.Ingress) (*k8sv1beta1.Ingress, error) {
	old, err := c.ExtensionsV1beta1().Ingresses(ingress.Namespace).Get(ingress.Name, metaV1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return c.ExtensionsV1beta1().Ingresses(ingress.Namespace).Create(ingress)
		}
		return nil, err
	}
	ingress.Spec.DeepCopyInto(&old.Spec)
	return c.ExtensionsV1beta1().Ingresses(ingress.Namespace).Update(old)
}

func GetIngressDetail(c *kubernetes.Clientset, name, namespace string) (*k8sv1beta1.Ingress, error) {
	ingress, err := c.ExtensionsV1beta1().Ingresses(namespace).Get(name, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}
	return ingress, nil
}

func DeleteIngress(c *kubernetes.Clientset, name, namespace string) error {
	return c.ExtensionsV1beta1().Ingresses(namespace).Delete(name, &metaV1.DeleteOptions{})
}
