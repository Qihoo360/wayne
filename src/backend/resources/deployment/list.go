package deployment

import (
	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
	"k8s.io/api/apps/v1beta1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func GetDeploymentPage(cli *kubernetes.Clientset, namespace string, q *common.QueryParam) (*common.Page, error) {
	deployments, err := GetDeploymentList(cli, namespace, metaV1.ListOptions{})
	if err != nil {
		return nil, err
	}

	return dataselector.DataSelectPage(toCells(deployments), q), nil
}

func toCells(deploy []v1beta1.Deployment) []dataselector.DataCell {
	cells := make([]dataselector.DataCell, len(deploy))
	for i := range deploy {
		cells[i] = DeploymentCell(deploy[i])
	}
	return cells
}
