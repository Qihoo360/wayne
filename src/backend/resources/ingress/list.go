package ingress

import (
	backendCommon "github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
	extensions "k8s.io/api/extensions/v1beta1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
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
		TypeMeta:   common.NewTypeMeta("ingress"),
		Endpoints:  getEndpoints(ingress),
	}
	return modelIngress
}

func GetIngressPage(cli *kubernetes.Clientset, namespace string, q *backendCommon.QueryParam) (page *backendCommon.Page, err error) {
	ingressPtrs, err := GetIngressList(cli, namespace, metaV1.ListOptions{})
	if err != nil {
		return nil, err
	}
	ingresses := make([]Ingress, len(ingressPtrs))
	for i := range ingressPtrs {
		ingresses[i] = *ingressPtrs[i]
	}
	return dataselector.DataSelectPage(toCells(ingresses), q), nil
}
