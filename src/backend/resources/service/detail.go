package service

import (
	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/endpoint"
	"github.com/Qihoo360/wayne/src/backend/resources/event"
	"github.com/Qihoo360/wayne/src/backend/resources/pod"

	"k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type ServiceDetail struct {
	ObjectMeta common.ObjectMeta `json:"objectMeta"`
	TypeMeta   common.TypeMeta   `json:"typeMeta"`

	// InternalEndpoint of all Kubernetes services that have the same label selector as connected Replication
	// Controller. Endpoints is DNS name merged with ports.
	InternalEndpoint common.Endpoint `json:"internalEndpoint"`

	// ExternalEndpoints of all Kubernetes services that have the same label selector as connected Replication
	// Controller. Endpoints is external IP address name merged with ports.
	ExternalEndpoints []common.Endpoint `json:"externalEndpoints"`

	// List of Endpoint obj. that are endpoints of this Service.
	EndpointList []endpoint.Endpoint `json:"endpointList"`

	// Label selector of the service.
	Selector map[string]string `json:"selector"`

	// Type determines how the service will be exposed.  Valid options: ClusterIP, NodePort, LoadBalancer
	Type v1.ServiceType `json:"type"`

	// ClusterIP is usually assigned by the master. Valid values are None, empty string (""), or
	// a valid IP address. None can be specified for headless services when proxying is not required
	ClusterIP string `json:"clusterIP"`

	// List of events related to this Service
	EventList []common.Event `json:"eventList"`

	// PodInfos represents list of pods status targeted by same label selector as this service.
	PodList []v1.Pod `json:"podList"`

	// Show the value of the SessionAffinity of the Service.
	SessionAffinity v1.ServiceAffinity `json:"sessionAffinity"`
}

func GetServiceDetail(cli *kubernetes.Clientset, indexer *client.CacheIndexer, namespace, name string) (*ServiceDetail, error) {

	serviceDate, err := cli.CoreV1().Services(namespace).Get(name, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}

	endpointsList := endpoint.GetServiceEndpointsFromCache(indexer, namespace, name)

	podList := pod.GetPodsBySelectorFromCache(indexer, namespace, serviceDate.Spec.Selector)

	eventList := event.GetPodsWarningEvents(indexer, podList)

	detail := toServiceDetail(serviceDate, eventList, podList, endpointsList)

	return &detail, nil
}

func toServiceDetail(service *v1.Service, events []common.Event, pods []v1.Pod, endpoints []endpoint.Endpoint) ServiceDetail {
	return ServiceDetail{
		ObjectMeta:        common.NewObjectMeta(service.ObjectMeta),
		TypeMeta:          common.NewTypeMeta(common.ResourceKind("service")),
		InternalEndpoint:  common.GetInternalEndpoint(service.Name, service.Namespace, service.Spec.Ports),
		ExternalEndpoints: common.GetExternalEndpoints(service),
		EndpointList:      endpoints,
		Selector:          service.Spec.Selector,
		ClusterIP:         service.Spec.ClusterIP,
		Type:              service.Spec.Type,
		EventList:         events,
		PodList:           pods,
		SessionAffinity:   service.Spec.SessionAffinity,
	}
}
