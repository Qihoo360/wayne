package namespace

import (
	"encoding/json"
	"sync"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/namespace"
	"github.com/Qihoo360/wayne/src/backend/util"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/labels"
	utilerrors "k8s.io/apimachinery/pkg/util/errors"
)

type KubeNamespaceController struct {
	base.APIController
}

func (c *KubeNamespaceController) URLMapping() {
	c.Mapping("Resources", c.Resources)
	c.Mapping("List", c.List)
}

func (c *KubeNamespaceController) Prepare() {
	// Check administration
	c.APIController.Prepare()
}

// @Title List namespace
// @Description get all namespace
// @Param	cluster		path 	string	true		"the cluster name"
// @Success 200 {object} common.Page success
// @router /clusters/:cluster [get]
func (c *KubeNamespaceController) List() {
	cluster := c.Ctx.Input.Param(":cluster")

	cli, err := client.Client(cluster)
	if err == nil {
		result, err := namespace.GetNamespaceList(cli)
		if err != nil {
			logs.Error("list kubernetes namespaces error.", cluster, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Get namespace info
// @Description get one namespace detail
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	namespace	path 	string	true		"the namespace name"
// @Success 200 {object} common.Page success
// @router /:name/clusters/:cluster [get]
func (c *KubeNamespaceController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	ns := c.Ctx.Input.Param(":name")

	cli, err := client.Client(cluster)
	if err == nil {
		result, err := namespace.GetNamespace(cli, ns)
		if err != nil {
			logs.Error("get kubernetes namespaces error.", cluster, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Update
// @Description update the Namespace
// @router /:name/clusters/:cluster [put]
func (c *KubeNamespaceController) Update() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	var tpl v1.Namespace
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &tpl)
	if err != nil {
		c.AbortBadRequestFormat("Namespace")
	}
	if name != tpl.Name {
		c.AbortBadRequestFormat("Name")
	}

	cli, err := client.Client(cluster)
	if err == nil {
		result, err := namespace.UpdateNamespace(cli, &tpl)
		if err != nil {
			logs.Error("update namespace (%v) by cluster (%s) error.%v", tpl, cluster, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
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

	cli, err := client.Client(cluster)
	if err == nil {
		// If the namespace does not exist, the value of result is nil.
		result, err := namespace.CreateNotExitNamespace(cli, tpl)
		if err != nil {
			logs.Error("create namespace (%v) by cluster (%s) error.%v", tpl, cluster, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Get namespace resource statistics
// @Description Get namespace resource statistics
// @Param	app	query 	string	false	"The app Name"
// @Param	nid	path 	string	true	"The namespace id"
// @Success 200 return ok success
// @router /:id([0-9]+)/resources [get]
func (c *KubeNamespaceController) Resources() {
	appName := c.Input().Get("app")
	id := c.GetIDFromURL()
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
	for _, manager := range managers {
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
			resourceUsage, err := namespace.ResourcesUsageByNamespace(m.Client, namespaceMetaData.Namespace, selector.String())
			if err != nil {
				logs.Error("get (%s) k8s resource usage error. %v", m.Cluster.Name, err.Error())
				errs = append(errs, err)
				return
			}
			syncResourceMap.Store(m.Cluster.Name, common.Resource{
				Usage: &common.ResourceList{
					Cpu:    resourceUsage.Cpu / 1000,
					Memory: resourceUsage.Memory / 1024,
				},
				Limit: &common.ResourceList{
					Cpu:    clusterMetas.ResourcesLimit.Cpu,
					Memory: clusterMetas.ResourcesLimit.Memory,
				},
			})
		}(manager)
	}
	wg.Wait()
	if len(errs) == len(managers) && len(errs) > 0 {
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
// @router /:id([0-9]+)/statistics [get]
func (c *KubeNamespaceController) Statistics() {
	appName := c.Input().Get("app")
	id := c.GetIDFromURL()
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
	for _, manager := range managers {
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
			resourceUsage, err := namespace.ResourcesOfAppByNamespace(m.Client, namespaceMetaData.Namespace, selector.String())
			if err != nil {
				logs.Error("get (%s) k8s resource usage error. %v", m.Cluster.Name, err.Error())
				errs = append(errs, err)
				return
			}
			syncResourceMap.Store(m.Cluster.Name, resourceUsage)
		}(manager)
	}
	wg.Wait()
	if len(errs) == len(managers) && len(errs) > 0 {
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
