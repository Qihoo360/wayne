package client

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/fields"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	kcache "k8s.io/client-go/tools/cache"
	"k8s.io/client-go/tools/clientcmd"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
	clientcmdlatest "k8s.io/client-go/tools/clientcmd/api/latest"
	clientcmdapiv1 "k8s.io/client-go/tools/clientcmd/api/v1"
)

const (
	// High enough QPS to fit all expected use cases.
	defaultQPS = 1e6
	// High enough Burst to fit all expected use cases.
	defaultBurst = 1e6
	// full resyc cache resource time
	defaultResyncPeriod = 30 * time.Second
)

var (
	ErrNotExist    = errors.New("cluster not exist. ")
	ErrMaintaining = errors.New("cluster being maintaining .please try again later. ")
)

var (
	clusterManagerSets = make(map[string]*ClusterManager)
)

type ClusterManager struct {
	Cluster *models.Cluster
	Client  *kubernetes.Clientset
	Config  *rest.Config
	Indexer *CacheIndexer
}

type CacheIndexer struct {
	stopChans chan struct{}
	Pod       kcache.Indexer
	Event     kcache.Indexer
}

func (c ClusterManager) Close() {
	c.Indexer.stopChans <- struct{}{}
}

func BuildApiserverClient() {
	newClusters, err := models.ClusterModel.GetAllNormal()
	if err != nil {
		logs.Error("build apiserver client get all cluster error.", err)
		return
	}

	changed := clusterChanged(newClusters)
	if changed {
		logs.Info("cluster changed, so resync info...")
		// build new clientManager
		newClusterManagerSets := make(map[string]*ClusterManager)
		for i := 0; i < len(newClusters); i++ {
			cluster := newClusters[i]

			if cluster.Master == "" {
				logs.Warning("cluster's master is null:%s", cluster.Name)
				continue
			}
			clientSet, config, err := buildClient(cluster.Master, cluster.KubeConfig)
			if err != nil {
				logs.Warning("build cluster (%s) client error :%v", cluster.Name, err)
				continue
			}

			cacheIndexer := buildCacheController(clientSet)
			clusterManager := &ClusterManager{
				Client:  clientSet,
				Config:  config,
				Cluster: &cluster,
				Indexer: cacheIndexer,
			}
			newClusterManagerSets[cluster.Name] = clusterManager

		}
		// stop all old cacheController
		stopAllCacheController()
		clusterManagerSets = newClusterManagerSets
	}

}

func stopAllCacheController() {
	// TODO 停止之后，controller 仍然会定期list维护中的集群资源，需要解决
	for _, manager := range clusterManagerSets {
		manager.Close()
	}
}

func clusterChanged(clusters []models.Cluster) bool {
	if len(clusterManagerSets) == 0 {
		return true
	}
	if len(clusterManagerSets) != len(clusters) {
		return true
	}

	for _, cluster := range clusters {
		manager, ok := clusterManagerSets[cluster.Name]
		if !ok {
			// maybe add new cluster
			return true
		}
		// master changed, the cluster is changed, ignore others
		if manager.Cluster.Master != cluster.Master {
			logs.Info("cluster master (%s) changed to (%s).", manager.Cluster.Master, cluster.Master)
			return true
		}
		if manager.Cluster.Status != cluster.Status {
			logs.Info("cluster status (%d) changed to (%d).", manager.Cluster.Status, cluster.Status)
			return true
		}

		if manager.Cluster.KubeConfig != manager.Cluster.KubeConfig {
			logs.Info("cluster kubeConfig (%d) changed to (%d).", manager.Cluster.KubeConfig, cluster.KubeConfig)
			return true
		}
	}

	return false
}

func buildCacheController(client *kubernetes.Clientset) *CacheIndexer {
	stopCh := make(chan struct{})
	// create the pod watcher
	podListWatcher := kcache.NewListWatchFromClient(client.CoreV1().RESTClient(), "pods", v1.NamespaceAll, fields.Everything())
	podIndexer, podInformer := kcache.NewIndexerInformer(podListWatcher, &v1.Pod{}, defaultResyncPeriod, kcache.ResourceEventHandlerFuncs{}, kcache.Indexers{})
	go podInformer.Run(stopCh)

	// create the event watcher
	eventListWatcher := kcache.NewListWatchFromClient(client.CoreV1().RESTClient(), "events", v1.NamespaceAll, fields.Everything())
	eventIndexer, eventInformer := kcache.NewIndexerInformer(eventListWatcher, &v1.Event{}, defaultResyncPeriod, kcache.ResourceEventHandlerFuncs{}, kcache.Indexers{})
	go eventInformer.Run(stopCh)

	return &CacheIndexer{
		Pod:       podIndexer,
		Event:     eventIndexer,
		stopChans: stopCh,
	}
}

func Cluster(cluster string) (*models.Cluster, error) {
	manager, exist := clusterManagerSets[cluster]
	// 如果不存在，则重新获取一次集群信息
	if !exist {
		BuildApiserverClient()
		manager, exist = clusterManagerSets[cluster]
		if !exist {
			return nil, ErrNotExist
		}
	}
	if manager.Cluster.Status == models.ClusterStatusMaintaining {
		return nil, ErrMaintaining
	}
	return manager.Cluster, nil
}

func Client(cluster string) (*kubernetes.Clientset, error) {
	manager, exist := clusterManagerSets[cluster]
	// 如果不存在，则重新获取一次集群信息
	if !exist {
		BuildApiserverClient()
		manager, exist = clusterManagerSets[cluster]
		if !exist {
			return nil, ErrNotExist
		}
	}
	if manager.Cluster.Status == models.ClusterStatusMaintaining {
		return nil, ErrMaintaining
	}
	return manager.Client, nil
}

func Manager(cluster string) (*ClusterManager, error) {
	manager, exist := clusterManagerSets[cluster]
	// 如果不存在，则重新获取一次集群信息
	if !exist {
		BuildApiserverClient()
		manager, exist = clusterManagerSets[cluster]
		if !exist {
			return nil, ErrNotExist
		}
	}
	if manager.Cluster.Status == models.ClusterStatusMaintaining {
		return nil, ErrMaintaining
	}
	return manager, nil
}

func Clients() map[string]*kubernetes.Clientset {
	clientSets := map[string]*kubernetes.Clientset{}
	for cluster, cManager := range clusterManagerSets {
		clientSets[cluster] = cManager.Client
	}
	return clientSets
}

func Managers() map[string]*ClusterManager {
	return clusterManagerSets
}

func buildClient(master string, kubeconfig string) (*kubernetes.Clientset, *rest.Config, error) {
	configV1 := clientcmdapiv1.Config{}
	err := json.Unmarshal([]byte(kubeconfig), &configV1)
	if err != nil {
		logs.Error("json unmarshal kubeconfig error. %v ", err)
		return nil, nil, err
	}
	configObject, err := clientcmdlatest.Scheme.ConvertToVersion(&configV1, clientcmdapi.SchemeGroupVersion)
	configInternal := configObject.(*clientcmdapi.Config)

	clientConfig, err := clientcmd.NewDefaultClientConfig(*configInternal, &clientcmd.ConfigOverrides{
		ClusterDefaults: clientcmdapi.Cluster{Server: master},
	}).ClientConfig()

	if err != nil {
		logs.Error("build client config error. %v ", err)
		return nil, nil, err
	}

	clientConfig.QPS = defaultQPS
	clientConfig.Burst = defaultBurst

	clientSet, err := kubernetes.NewForConfig(clientConfig)

	if err != nil {
		logs.Error("(%s) kubernetes.NewForConfig(%v) error.%v", master, err, clientConfig)
		return nil, nil, err
	}

	return clientSet, clientConfig, nil
}
