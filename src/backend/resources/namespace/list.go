package namespace

import (
	"k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func GetNamespace(cli *kubernetes.Clientset, namespace string) (*v1.Namespace, error) {
	kubeNamespaces, err := cli.CoreV1().Namespaces().List(metaV1.ListOptions{})
	if err != nil {
		return nil, err
	}

	for _, ns := range kubeNamespaces.Items {
		if ns.Name == namespace {
			return &ns, nil
		}
	}
	return nil, nil
}
