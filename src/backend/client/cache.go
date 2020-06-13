package client

import (
	"github.com/Qihoo360/wayne/src/backend/client/api"
	"k8s.io/client-go/informers"
	"k8s.io/client-go/kubernetes"
	appsv1 "k8s.io/client-go/listers/apps/v1"
	autoscalingv1 "k8s.io/client-go/listers/autoscaling/v1"
	"k8s.io/client-go/listers/core/v1"
)

type CacheFactory struct {
	stopChan              chan struct{}
	sharedInformerFactory informers.SharedInformerFactory
}

func (c ClusterManager) Close() {
	close(c.CacheFactory.stopChan)
}

func buildCacheController(client *kubernetes.Clientset) (*CacheFactory, error) {
	stop := make(chan struct{})
	sharedInformerFactory := informers.NewSharedInformerFactory(client, defaultResyncPeriod)

	rangeMap, err := api.GetResourceMap(client)
	if err != nil {
		return nil, err
	}
	// Start all Resources defined in KindToResourceMap
	for _, value := range rangeMap {

		genericInformer, err := sharedInformerFactory.ForResource(value.GroupVersionResourceKind.GroupVersionResource)
		if err != nil {
			return nil, err
		}
		go genericInformer.Informer().Run(stop)
	}

	sharedInformerFactory.Start(stop)

	return &CacheFactory{
		stopChan:              stop,
		sharedInformerFactory: sharedInformerFactory,
	}, nil
}

func (c *CacheFactory) PodLister() v1.PodLister {
	return c.sharedInformerFactory.Core().V1().Pods().Lister()
}

func (c *CacheFactory) EventLister() v1.EventLister {
	return c.sharedInformerFactory.Core().V1().Events().Lister()
}

func (c *CacheFactory) DeploymentLister() appsv1.DeploymentLister {
	return c.sharedInformerFactory.Apps().V1().Deployments().Lister()
}

func (c *CacheFactory) NodeLister() v1.NodeLister {
	return c.sharedInformerFactory.Core().V1().Nodes().Lister()
}

func (c *CacheFactory) EndpointLister() v1.EndpointsLister {
	return c.sharedInformerFactory.Core().V1().Endpoints().Lister()
}

func (c *CacheFactory) HPALister() autoscalingv1.HorizontalPodAutoscalerLister {
	return c.sharedInformerFactory.Autoscaling().V1().HorizontalPodAutoscalers().Lister()
}
