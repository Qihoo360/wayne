package client

import (
	"k8s.io/client-go/informers"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/listers/apps/v1beta1"
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

func buildCacheController(client *kubernetes.Clientset) *CacheFactory {
	stop := make(chan struct{})
	sharedInformerFactory := informers.NewSharedInformerFactory(client, defaultResyncPeriod)

	// Resources that need to be cached are started here
	go sharedInformerFactory.Core().V1().Events().Informer().Run(stop)
	go sharedInformerFactory.Core().V1().Pods().Informer().Run(stop)
	go sharedInformerFactory.Apps().V1beta1().Deployments().Informer().Run(stop)
	go sharedInformerFactory.Core().V1().Nodes().Informer().Run(stop)
	go sharedInformerFactory.Core().V1().Endpoints().Informer().Run(stop)
	go sharedInformerFactory.Autoscaling().V1().HorizontalPodAutoscalers().Informer().Run(stop)

	sharedInformerFactory.Start(stop)

	return &CacheFactory{
		stopChan:              stop,
		sharedInformerFactory: sharedInformerFactory,
	}
}

func (c *CacheFactory) PodLister() v1.PodLister {
	return c.sharedInformerFactory.Core().V1().Pods().Lister()
}

func (c *CacheFactory) EventLister() v1.EventLister {
	return c.sharedInformerFactory.Core().V1().Events().Lister()
}

func (c *CacheFactory) DeploymentLister() v1beta1.DeploymentLister {
	return c.sharedInformerFactory.Apps().V1beta1().Deployments().Lister()
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
