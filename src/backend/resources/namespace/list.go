package namespace

import (
	"k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
)

func GetNamespacePage(cli *kubernetes.Clientset, q *common.QueryParam) (*common.Page, error) {
	kubeNamespaces, err := cli.CoreV1().Namespaces().List(metaV1.ListOptions{})
	if err != nil {
		return nil, err
	}

	namespaces := make([]Namespace, 0)

	for i := 0; i < len(kubeNamespaces.Items); i++ {
		namespaces = append(namespaces, *toNamespace(&kubeNamespaces.Items[i]))
	}
	return dataselector.DataSelectPage(toCells(namespaces), q), nil
}

func GetAllNamespaceName(cli *kubernetes.Clientset) ([]string, error) {
	kubeNamespaces, err := cli.CoreV1().Namespaces().List(metaV1.ListOptions{})
	if err != nil {
		return nil, err
	}

	namespaces := make([]string, 0)

	for _, ns := range kubeNamespaces.Items {
		namespaces = append(namespaces, ns.Name)
	}
	return namespaces, nil
}

func toCells(ns []Namespace) []dataselector.DataCell {
	cells := make([]dataselector.DataCell, len(ns))
	for i := range ns {
		cells[i] = NamespaceCell(ns[i])
	}
	return cells
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
