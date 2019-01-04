package endpoint

import (
	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/resources/common"

	"k8s.io/api/core/v1"
)

type Endpoint struct {
	ObjectMeta common.ObjectMeta `json:"objectMeta"`
	TypeMeta   common.TypeMeta   `json:"typeMeta"`

	// Hostname, either as a domain name or IP address.
	Host string `json:"host"`

	// Name of the node the endpoint is located
	NodeName *string `json:"nodeName"`

	// Status of the endpoint
	Ready bool `json:"ready"`

	// Array of endpoint ports
	Ports []v1.EndpointPort `json:"ports"`
}

// GetEndpoints gets endpoints associated to resource with given name.
func GetServiceEndpointsFromCache(cache *client.CacheFactory, namespace, name string) ([]Endpoint, error) {
	endpoint, err := cache.EndpointLister().Endpoints(namespace).Get(name)
	if err != nil {
		return nil, err
	}
	return toEndpointList(endpoint), nil
}

func toEndpointList(endpoint *v1.Endpoints) (list []Endpoint) {
	for _, subSets := range endpoint.Subsets {
		for _, address := range subSets.Addresses {
			list = append(list, *toEndpoint(address, subSets.Ports, true))
		}
		for _, notReadyAddress := range subSets.NotReadyAddresses {
			list = append(list, *toEndpoint(notReadyAddress, subSets.Ports, false))
		}
	}

	return
}

func toEndpoint(address v1.EndpointAddress, ports []v1.EndpointPort, ready bool) *Endpoint {
	return &Endpoint{
		TypeMeta: common.NewTypeMeta(common.ResourceKind("endpoint")),
		Host:     address.IP,
		Ports:    ports,
		Ready:    ready,
		NodeName: address.NodeName,
	}
}
