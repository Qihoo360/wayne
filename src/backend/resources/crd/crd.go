package crd

import (
	"k8s.io/apiextensions-apiserver/pkg/client/clientset/clientset"

	apiextensions "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
)

func GetCRDPage(cli *clientset.Clientset, q *common.QueryParam) (*common.Page, error) {
	crdList, err := cli.ApiextensionsV1beta1().CustomResourceDefinitions().List(metaV1.ListOptions{})
	if err != nil {
		return nil, err
	}
	return dataselector.DataSelectPage(toCells(crdList.Items), q), nil
}

func toCells(deploy []apiextensions.CustomResourceDefinition) []dataselector.DataCell {
	cells := make([]dataselector.DataCell, len(deploy))
	for i := range deploy {
		cells[i] = CRDCell(deploy[i])
	}
	return cells
}
