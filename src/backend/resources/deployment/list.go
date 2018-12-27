package deployment

import (
	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func GetDeploymentPage(indexer *client.CacheIndexer, namespace string, q *common.QueryParam) (*common.Page, error) {
	kubeDeployments, err := GetDeploymentList(indexer, namespace, metaV1.ListOptions{})
	if err != nil {
		return nil, err
	}

	deployments := make([]Deployment, 0)

	for i := 0; i < len(kubeDeployments); i++ {
		deployments = append(deployments, *toDeployment(&kubeDeployments[i], indexer))
	}

	return dataselector.DataSelectPage(toCells(deployments), q), nil
}

func toCells(deploy []Deployment) []dataselector.DataCell {
	cells := make([]dataselector.DataCell, len(deploy))
	for i := range deploy {
		cells[i] = DeploymentCell(deploy[i])
	}
	return cells
}
