package service

import (
	backendCommon "github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
	"k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type Service struct {
	ObjectMeta common.ObjectMeta `json:"objectMeta"`
	TypeMeta   common.TypeMeta   `json:"typeMeta"`

	// InternalEndpoint of all Kubernetes services that have the same label selector as connected Replication
	// Controller. Endpoint is DNS name merged with ports.
	InternalEndpoint common.Endpoint `json:"internalEndpoint"`

	// ExternalEndpoints of all Kubernetes services that have the same label selector as connected Replication
	// Controller. Endpoint is external IP address name merged with ports.
	ExternalEndpoints []common.Endpoint `json:"externalEndpoints"`

	// Label selector of the service.
	Selector map[string]string `json:"selector"`

	// Type determines how the service will be exposed.  Valid options: ClusterIP, NodePort, LoadBalancer
	Type v1.ServiceType `json:"type"`

	// ClusterIP is usually assigned by the master. Valid values are None, empty string (""), or
	// a valid IP address. None can be specified for headless services when proxying is not required
	ClusterIP string `json:"clusterIP"`
}

func toService(serviceData v1.Service) Service {
	return Service{
		ObjectMeta:        common.NewObjectMeta(serviceData.ObjectMeta),
		TypeMeta:          common.NewTypeMeta(common.ResourceKind("service")),
		InternalEndpoint:  common.GetInternalEndpoint(serviceData.Name, serviceData.Namespace, serviceData.Spec.Ports),
		ExternalEndpoints: common.GetExternalEndpoints(&serviceData),
		Selector:          serviceData.Spec.Selector,
		Type:              serviceData.Spec.Type,
		ClusterIP:         serviceData.Spec.ClusterIP,
	}
}

func GetServiceList(cli *kubernetes.Clientset, namespace string, opts metaV1.ListOptions) (list []Service, err error) {
	serviceDataList, err := cli.CoreV1().Services(namespace).List(opts)
	if err != nil {
		return nil, err
	}
	for _, serviceData := range serviceDataList.Items {
		list = append(list, toService(serviceData))
	}
	return
}

func GetServicePage(cli *kubernetes.Clientset, namespace string, q *backendCommon.QueryParam) (page *backendCommon.Page, err error) {
	servicesData, err := GetServiceList(cli, namespace, metaV1.ListOptions{})
	if err != nil {
		return nil, err
	}
	return dataselector.DataSelectPage(toCell(servicesData), q), nil
}
