package pod

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/client/api"
	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	erroresult "github.com/Qihoo360/wayne/src/backend/models/response/errors"
	"github.com/Qihoo360/wayne/src/backend/resources/pod"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubePodController struct {
	base.APIController
}

func (c *KubePodController) URLMapping() {
	c.Mapping("PodStatistics", c.PodStatistics)
	c.Mapping("List", c.List)
	c.Mapping("Terminal", c.Terminal)
	c.Mapping("GetEvent", c.GetEvent)
}

func (c *KubePodController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"PodStatistics": models.PermissionRead,
		"List":          models.PermissionRead,
		"Terminal":      models.PermissionRead,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubePod)
}

// @Title kubernetes pod statistics
// @Description kubernetes statistics
// @Param	cluster	query 	string	false		"the cluster "
// @Success 200 {object} models.AppCount success
func (c *KubePodController) PodStatistics() {
	cluster := c.Input().Get("cluster")
	total := 0
	countSyncMap := sync.Map{}
	countMap := make(map[string]int)
	if cluster == "" {
		managers := client.Managers()
		wg := sync.WaitGroup{}

		managers.Range(func(key, value interface{}) bool {
			manager := value.(*client.ClusterManager)
			wg.Add(1)
			go func(manager *client.ClusterManager) {
				defer wg.Done()
				count, err := pod.GetPodCounts(manager.CacheFactory)
				if err != nil {
					logs.Error("get pod counts error.", key, err)
					return
				}
				total += count
				countSyncMap.Store(manager.Cluster.Name, count)
			}(manager)
			return true
		})

		wg.Wait()
		countSyncMap.Range(func(key, value interface{}) bool {
			countMap[key.(string)] = value.(int)
			return true
		})

	} else {
		manager, err := client.Manager(cluster)
		if err == nil {
			count, err := pod.GetPodCounts(manager.CacheFactory)
			if err != nil {
				c.HandleError(err)
				return
			}
			total += count
		} else {
			c.HandleError(err)
			return
		}

	}

	c.Success(pod.PodStatistics{Total: total, Details: countMap})
}

// @Title List
// @Description find pods by resource type
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	type		query 	string	true		"the query type. deployment, statefulset, daemonSet, job, pod"
// @Param	name		query 	string	true		"the query resource name."
// @Success 200 {object} models.Deployment success
// @router /namespaces/:namespace/clusters/:cluster [get]
func (c *KubePodController) List() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	resourceType := c.Input().Get("type")
	resourceName := c.Input().Get("name")
	param := c.BuildKubernetesQueryParam()
	manager := c.Manager(cluster)
	var result *common.Page
	var err error
	switch resourceType {
	case api.ResourceNameDeployment:
		result, err = pod.GetPodsByDeploymentPage(manager.KubeClient, namespace, resourceName, param)
	case api.ResourceNameStatefulSet:
		result, err = pod.GetRelatedPodByType(manager.KubeClient, namespace, resourceName, api.ResourceNameStatefulSet, param)
	case api.ResourceNameDaemonSet:
		result, err = pod.GetRelatedPodByType(manager.KubeClient, namespace, resourceName, api.ResourceNameDaemonSet, param)
	case api.ResourceNameJob:
		result, err = pod.GetRelatedPodByType(manager.KubeClient, namespace, resourceName, api.ResourceNameJob, param)
	case api.ResourceNamePod:
		result, err = pod.GetPodPage(manager.KubeClient, namespace, resourceName, param)
	default:
		err = &erroresult.ErrorResult{
			Code: http.StatusBadRequest,
			Msg:  fmt.Sprintf("Unsupported resource type (%s). ", resourceType),
		}
	}
	if err != nil {
		logs.Error("Get kubernetes pod by type error.", cluster, namespace, resourceType, resourceName, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title GetPodEvent
// @Description Get Pod Event by resource type and name
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	type		query 	string	true		"the query type. deployments, statefulsets, daemonsets,cronjobs"
// @Param	name		query 	string	true		"the query resource name."
// @Success 200 {object} models.Deployment success
// @router /events/namespaces/:namespace/clusters/:cluster [get]
func (c *KubePodController) GetEvent() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	resourceType := c.Input().Get("type")
	resourceName := c.Input().Get("name")
	param := c.BuildKubernetesQueryParam()
	manager := c.Manager(cluster)
	var result *common.Page
	var err error
	switch resourceType {
	case api.ResourceNameDeployment:
		result, err = pod.GetPodsByDeploymentPage(manager.KubeClient, namespace, resourceName, param)
	case api.ResourceNameStatefulSet:
		result, err = pod.GetRelatedPodByType(manager.KubeClient, namespace, resourceName, api.ResourceNameStatefulSet, param)
	case api.ResourceNameDaemonSet:
		result, err = pod.GetRelatedPodByType(manager.KubeClient, namespace, resourceName, api.ResourceNameDaemonSet, param)
	case api.ResourceNameCronJob:
		result, err = pod.GetRelatedPodByType(manager.KubeClient, namespace, resourceName, api.ResourceNameJob, param)
	default:
		err = &erroresult.ErrorResult{
			Code: http.StatusBadRequest,
			Msg:  fmt.Sprintf("Unsupported resource type (%s). ", resourceType),
		}
	}
	if err != nil {
		logs.Error("Get kubernetes pod by type error.", cluster, namespace, resourceType, resourceName, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}
