package namespace

import (
	"k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
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

func UpdateNamespace(cli *kubernetes.Clientset, ns *v1.Namespace) (*v1.Namespace, error) {
	newNS, err := cli.CoreV1().Namespaces().Update(ns)
	if err != nil {
		return nil, err
	}
	return newNS, nil
}

func CreateNotExitNamespace(cli *kubernetes.Clientset, ns *v1.Namespace) (*v1.Namespace, error) {
	_, err := cli.CoreV1().Namespaces().Get(ns.Name, metaV1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return cli.CoreV1().Namespaces().Create(ns)
		}
		return nil, err
	}
	return nil, nil
}
