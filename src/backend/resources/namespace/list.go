package namespace

import (
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func GetNamespaceList(cli *kubernetes.Clientset) ([]Namespace, error) {
	kubeNamespaces, err := cli.CoreV1().Namespaces().List(metaV1.ListOptions{})
	if err != nil {
		return nil, err
	}

	namespaces := make([]Namespace, 0)

	for i := 0; i < len(kubeNamespaces.Items); i++ {
		namespaces = append(namespaces, *toNamespace(&kubeNamespaces.Items[i]))
	}

	return namespaces, nil
}
