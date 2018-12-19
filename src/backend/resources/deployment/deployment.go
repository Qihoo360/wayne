package deployment

import (
	"fmt"
	"net/http"

	"k8s.io/api/apps/v1beta1"
	"k8s.io/apimachinery/pkg/api/errors"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/client"
	erroresult "github.com/Qihoo360/wayne/src/backend/models/response/errors"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/event"
	"github.com/Qihoo360/wayne/src/backend/resources/pod"
	"github.com/Qihoo360/wayne/src/backend/util/maps"
)

type Deployment struct {
	ObjectMeta common.ObjectMeta `json:"objectMeta"`
	Pods       common.PodInfo    `json:"pods"`
	Containers []string          `json:"containers"`
}

func GetDeploymentList(cli *kubernetes.Clientset, namespace string, opts metaV1.ListOptions) ([]v1beta1.Deployment, error) {
	deployments, err := cli.AppsV1beta1().Deployments(namespace).List(opts)
	if err != nil {
		return nil, err
	}

	return deployments.Items, nil
}

func GetDeploymentResource(cli *kubernetes.Clientset, deployment *v1beta1.Deployment) (*common.ResourceList, error) {
	old, err := cli.AppsV1beta1().Deployments(deployment.Namespace).Get(deployment.Name, metaV1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return common.DeploymentResourceList(deployment), nil
		}
		return nil, err
	}
	oldResourceList := common.DeploymentResourceList(old)
	newResourceList := common.DeploymentResourceList(deployment)

	return &common.ResourceList{
		Cpu:    newResourceList.Cpu - oldResourceList.Cpu,
		Memory: newResourceList.Memory - oldResourceList.Memory,
	}, nil
}

func CreateOrUpdateDeployment(cli *kubernetes.Clientset, deployment *v1beta1.Deployment) (*v1beta1.Deployment, error) {
	old, err := cli.AppsV1beta1().Deployments(deployment.Namespace).Get(deployment.Name, metaV1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return cli.AppsV1beta1().Deployments(deployment.Namespace).Create(deployment)
		}
		return nil, err
	}
	err = checkDeploymentLabelSelector(deployment, old)
	if err != nil {
		return nil, err
	}

	old.Labels = deployment.Labels
	old.Annotations = deployment.Annotations
	old.Spec = deployment.Spec

	return cli.AppsV1beta1().Deployments(deployment.Namespace).Update(old)
}

func UpdateDeployment(cli *kubernetes.Clientset, deployment *v1beta1.Deployment) (*v1beta1.Deployment, error) {
	old, err := cli.AppsV1beta1().Deployments(deployment.Namespace).Get(deployment.Name, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}

	err = checkDeploymentLabelSelector(deployment, old)
	if err != nil {
		return nil, err
	}

	return cli.AppsV1beta1().Deployments(deployment.Namespace).Update(deployment)
}

// check Deployment .Spec.Selector.MatchLabels, prevent orphan ReplicaSet
// old deployment .Spec.Selector.MatchLabels labels should contain all new deployment .Spec.Selector.MatchLabels labels
// e.g. old Deployment .Spec.Selector.MatchLabels is app = infra-wayne,wayne-app = infra
// new Deployment .Spec.Selector.MatchLabels valid labels is
// app = infra-wayne or wayne-app = infra or app = infra-wayne,wayne-app = infra
func checkDeploymentLabelSelector(new *v1beta1.Deployment, old *v1beta1.Deployment) error {
	for key, value := range new.Spec.Selector.MatchLabels {
		oldValue, ok := old.Spec.Selector.MatchLabels[key]
		if !ok || oldValue != value {
			return &erroresult.ErrorResult{
				Code: http.StatusBadRequest,
				Msg: fmt.Sprintf("New's Deployment MatchLabels(%s) not match old MatchLabels(%s), do not allow deploy to prevent the orphan ReplicaSet. ",
					maps.LabelsToString(new.Spec.Selector.MatchLabels), maps.LabelsToString(old.Spec.Selector.MatchLabels)),
			}
		}
	}

	return nil
}

func GetDeployment(cli *kubernetes.Clientset, name, namespace string) (*v1beta1.Deployment, error) {
	return cli.AppsV1beta1().Deployments(namespace).Get(name, metaV1.GetOptions{})
}

func GetDeploymentDetail(cli *kubernetes.Clientset, indexer *client.CacheIndexer, name, namespace string) (*Deployment, error) {
	deployment, err := cli.AppsV1beta1().Deployments(namespace).Get(name, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}

	return toDeployment(deployment, indexer), nil
}

func toDeployment(deployment *v1beta1.Deployment, indexer *client.CacheIndexer) *Deployment {
	result := &Deployment{
		ObjectMeta: common.NewObjectMeta(deployment.ObjectMeta),
	}

	podInfo := common.PodInfo{}
	podInfo.Current = deployment.Status.AvailableReplicas
	podInfo.Desired = *deployment.Spec.Replicas

	pods := pod.GetPodsBySelectorFromCache(indexer, deployment.Namespace, deployment.Spec.Template.Labels)

	podInfo.Warnings = event.GetPodsWarningEvents(indexer, pods)

	result.Pods = podInfo

	containers := make([]string, 0)
	for _, container := range deployment.Spec.Template.Spec.Containers {
		containers = append(containers, container.Image)
	}

	result.Containers = containers

	return result
}

func DeleteDeployment(cli *kubernetes.Clientset, name, namespace string) error {
	deletionPropagation := metaV1.DeletePropagationBackground
	return cli.ExtensionsV1beta1().
		Deployments(namespace).
		Delete(name, &metaV1.DeleteOptions{PropagationPolicy: &deletionPropagation})
}
