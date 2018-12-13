package ingress

import (
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/kubernetes/dashboard/src/app/backend/api"
	extensions "k8s.io/api/extensions/v1beta1"
)

type Ingress struct {
	common.ObjectMeta `json:"objectMeta"`
	common.TypeMeta   `json:"typeMeta"`
	Endpoints         []common.Endpoint `json:"endpoints"`
}

func getEndpoints(ingress *extensions.Ingress) []common.Endpoint {
	endpoints := make([]common.Endpoint, 0)
	if len(ingress.Status.LoadBalancer.Ingress) > 0 {
		for _, status := range ingress.Status.LoadBalancer.Ingress {
			endpoint := common.Endpoint{Host: status.IP}
			endpoints = append(endpoints, endpoint)
		}
	}
	return endpoints
}

func toIngress(ingress *extensions.Ingress) *Ingress {
	modelIngress := &Ingress{
		ObjectMeta: common.NewObjectMeta(ingress.ObjectMeta),
		TypeMeta:   common.NewTypeMeta(api.ResourceKindIngress),
		Endpoints:  getEndpoints(ingress),
	}
	return modelIngress
}
