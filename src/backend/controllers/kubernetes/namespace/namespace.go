package namespace

import (
	"encoding/json"
	"sync"

	"k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/labels"
	utilerrors "k8s.io/apimachinery/pkg/util/errors"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/namespace"
	"github.com/Qihoo360/wayne/src/backend/util"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/util/maps"
)

type KubeNamespaceController struct {
	base.APIController
}

func (c *KubeNamespaceController) URLMapping() {
	c.Mapping("Resources", c.Resources)
	c.Mapping("Statistics", c.Statistics)
	c.Mapping("Create", c.Create)
}

func (c *KubeNamespaceController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"Resources":  models.PermissionRead,
		"Statistics": models.PermissionRead,
		"Create":     models.PermissionCreate,
	}
	_, method := c.GetControllerAndAction()
	switch method {
	case "Resources", "Statistics":
		c.PreparePermission(methodActionMap, method, models.PermissionTypeNamespace)
	case "Create":
		c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeNamespace)
	}
}

// @Title Create
// @Description create the namespace
// @router /:name/clusters/:cluster [post]
func (c *KubeNamespaceController) Create() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	tpl := new(v1.Namespace)
	tpl.Name = name

	cli := c.Client(cluster)
	// If the namespace does not exist, the value of result is nil.
	result, err := namespace.CreateNotExitNamespace(cli, tpl)
	if err != nil {
		logs.Error("create namespace (%v) by cluster (%s) error.%v", tpl, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Get namespace resource statistics
// @Description Get namespace resource statistics
// @Param	app	query 	string	false	"The app Name"
// @Param	nid	path 	string	true	"The namespace id"
// @Success 200 return ok success
// @router /:namespaceid([0-9]+)/resources [get]
func (c *KubeNamespaceController) Resources() {
	appName := c.Input().Get("app")
	id := c.GetIntParamFromURL(":namespaceid")
	ns, err := models.NamespaceModel.GetById(int64(id))
	if err != nil {
		logs.Warning("get namespace by id (%d) error. %v", id, err)
		c.HandleError(err)
		return
	}
	var namespaceMetaData models.NamespaceMetaData
	err = json.Unmarshal(hack.Slice(ns.MetaData), &namespaceMetaData)
	if err != nil {
		logs.Error("Unmarshal namespace metadata (%s) error. %v", ns.MetaData, err)
		c.HandleError(err)
		return
	}

	syncResourceMap := sync.Map{}
	var errs []error
	wg := sync.WaitGroup{}

	managers := client.Managers()
	managers.Range(func(key, value interface{}) bool {
		manager := value.(*client.ClusterManager)
		wg.Add(1)
		go func(m *client.ClusterManager) {
			defer wg.Done()
			clusterMetas, ok := namespaceMetaData.ClusterMetas[m.Cluster.Name]
			// can't use current cluster
			if !ok {
				return
			}

			selectorMap := map[string]string{
				util.NamespaceLabelKey: ns.Name,
			}
			if appName != "" {
				selectorMap[util.AppLabelKey] = appName
			}
			selector := labels.SelectorFromSet(selectorMap)
			resourceUsage, err := namespace.ResourcesUsageByNamespace(m.KubeClient, ns.KubeNamespace, selector.String())
			if err != nil {
				logs.Error("get (%s) k8s resource usage error. %v", m.Cluster.Name, err.Error())
				errs = append(errs, err)
				return
			}
			syncResourceMap.Store(m.Cluster.Name, common.Resource{
				Usage: &common.ResourceList{
					Cpu:    resourceUsage.Cpu / 1000,
					Memory: resourceUsage.Memory / (1024 * 1024 * 1024),
				},
				Limit: &common.ResourceList{
					Cpu:    clusterMetas.ResourcesLimit.Cpu,
					Memory: clusterMetas.ResourcesLimit.Memory,
				},
			})
		}(manager)
		return true
	})
	wg.Wait()

	if len(errs) == maps.SyncMapLen(managers) && len(errs) > 0 {
		c.HandleError(utilerrors.NewAggregate(errs))
		return
	}
	result := make(map[string]common.Resource)
	syncResourceMap.Range(func(key, value interface{}) bool {
		result[key.(string)] = value.(common.Resource)
		return true
	})
	c.Success(result)
}

// @Title Get namespace resource statistics 2.0
// @Description Get namespace resource statistics for report
// @Param	app	query 	string	false	"The app Name"
// @Param	nid	path 	string	true	"The namespace id"
// @Success 200 return ok success
// @router /:namespaceid([0-9]+)/statistics [get]
func (c *KubeNamespaceController) Statistics() {
	appName := c.Input().Get("app")
	id := c.GetIntParamFromURL(":namespaceid")
	ns, err := models.NamespaceModel.GetById(int64(id))
	if err != nil {
		logs.Warning("get namespace by id (%d) error. %v", id, err)
		c.HandleError(err)
		return
	}
	var namespaceMetaData models.NamespaceMetaData
	err = json.Unmarshal(hack.Slice(ns.MetaData), &namespaceMetaData)
	if err != nil {
		logs.Error("Unmarshal namespace metadata (%s) error. %v", ns.MetaData, err)
		c.HandleError(err)
		return
	}

	syncResourceMap := sync.Map{}
	var errs []error
	wg := sync.WaitGroup{}
	managers := client.Managers()
	managers.Range(func(key, value interface{}) bool {
		manager := value.(*client.ClusterManager)
		wg.Add(1)
		go func(m *client.ClusterManager) {
			defer wg.Done()
			selectorMap := map[string]string{
				util.NamespaceLabelKey: ns.Name,
			}
			if appName != "" {
				selectorMap[util.AppLabelKey] = appName
			}
			selector := labels.SelectorFromSet(selectorMap)
			resourceUsage, err := namespace.ResourcesOfAppByNamespace(m.KubeClient, ns.KubeNamespace, selector.String())
			if err != nil {
				logs.Error("get (%s) k8s resource usage error. %v", m.Cluster.Name, err.Error())
				errs = append(errs, err)
				return
			}
			syncResourceMap.Store(m.Cluster.Name, resourceUsage)
		}(manager)
		return true
	})

	wg.Wait()
	if len(errs) == maps.SyncMapLen(managers) && len(errs) > 0 {
		c.HandleError(utilerrors.NewAggregate(errs))
		return
	}
	result := make(map[string]*common.ResourceApp)
	syncResourceMap.Range(func(key, value interface{}) bool {
		for k, v := range value.(map[string]*common.ResourceApp) {
			if result[k] == nil {
				result[k] = v
			} else {
				result[k].Cpu += v.Cpu
				result[k].Memory += v.Memory
				result[k].PodNum += v.PodNum
			}
		}
		return true
	})
	c.Success(result)

}
