package client

import (
	"encoding/json"
	"errors"
	"sync"
	"time"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
	clientcmdlatest "k8s.io/client-go/tools/clientcmd/api/latest"
	clientcmdapiv1 "k8s.io/client-go/tools/clientcmd/api/v1"

	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/util/maps"
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
	clusterManagerSets = &sync.Map{}
)

type ClusterManager struct {
	Cluster *models.Cluster
	// Deprecated: use KubeClient instead
	Client *kubernetes.Clientset
	// Deprecated: use KubeClient instead
	CacheFactory *CacheFactory
	Config       *rest.Config
	KubeClient   ResourceHandler
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

		shouldRemoveClusters(newClusters)
		// build new clientManager
		for i := 0; i < len(newClusters); i++ {
			cluster := newClusters[i]
			// deal with deleted cluster
			if cluster.Master == "" {
				logs.Warning("cluster's master is null:%s", cluster.Name)
				continue
			}
			clientSet, config, err := buildClient(cluster.Master, cluster.KubeConfig)
			if err != nil {
				logs.Warning("build cluster (%s) client error :%v", cluster.Name, err)
				continue
			}

			cacheFactory, err := buildCacheController(clientSet)
			if err != nil {
				logs.Warning("build cluster (%s) cache controller error :%v", cluster.Name, err)
				continue
			}

			clusterManager := &ClusterManager{
				Client:       clientSet,
				Config:       config,
				Cluster:      &cluster,
				CacheFactory: cacheFactory,
				KubeClient:   NewResourceHandler(clientSet, cacheFactory),
			}
			managerInterface, ok := clusterManagerSets.Load(cluster.Name)
			if ok {
				manager := managerInterface.(*ClusterManager)
				manager.Close()
			}

			clusterManagerSets.Store(cluster.Name, clusterManager)
		}
		logs.Info("resync cluster finished! ")
	}

}

// deal with deleted cluster
func shouldRemoveClusters(changedClusters []models.Cluster) {
	changedClusterMap := make(map[string]struct{})
	for _, cluster := range changedClusters {
		changedClusterMap[cluster.Name] = struct{}{}
	}

	clusterManagerSets.Range(func(key, value interface{}) bool {
		if _, ok := changedClusterMap[key.(string)]; !ok {
			managerInterface, _ := clusterManagerSets.Load(key)
			manager := managerInterface.(*ClusterManager)
			manager.Close()
			clusterManagerSets.Delete(key)
		}
		return true
	})
}

func clusterChanged(clusters []models.Cluster) bool {
	if maps.SyncMapLen(clusterManagerSets) != len(clusters) {
		logs.Info("cluster length (%d) changed to (%d).", maps.SyncMapLen(clusterManagerSets), len(clusters))
		return true
	}

	for _, cluster := range clusters {
		managerInterface, ok := clusterManagerSets.Load(cluster.Name)
		if !ok {
			// maybe add new cluster
			return true
		}
		manager := managerInterface.(*ClusterManager)
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

func Cluster(cluster string) (*models.Cluster, error) {
	manager, err := Manager(cluster)
	if err != nil {
		return nil, err
	}
	return manager.Cluster, nil
}

func Client(cluster string) (*kubernetes.Clientset, error) {
	manager, err := Manager(cluster)
	if err != nil {
		return nil, err
	}
	return manager.Client, nil
}

func Manager(cluster string) (*ClusterManager, error) {
	managerInterface, exist := clusterManagerSets.Load(cluster)
	// 如果不存在，则重新获取一次集群信息
	if !exist {
		BuildApiserverClient()
		_, exist = clusterManagerSets.Load(cluster)
		if !exist {
			return nil, ErrNotExist
		}
	}
	manager := managerInterface.(*ClusterManager)
	if manager.Cluster.Status == models.ClusterStatusMaintaining {
		return nil, ErrMaintaining
	}
	return manager, nil
}

func Managers() *sync.Map {
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
