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
	c.Mapping("Get", c.Get)
	c.Mapping("Delete", c.Delete)
	c.Mapping("List", c.List)
}

func (c *KubePodController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Get", "List":
		perAction = models.PermissionRead
	case "Delete":
		perAction = models.PermissionDelete
	}
	if perAction != "" {
		c.CheckPermission(models.PermissionTypeDeployment, perAction)
	}
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
// @router /namespaces/:namespace/clusters/:cluster/page [get]
func (c *KubePodController) ListPage() {
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
		result, err = pod.GetRelatedPodByType(manager.KubeClient, namespace, resourceName, api.ResourceNamePod, param)
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

// @Title List
// @Description find pods by deployment
// @Param	deployment		query 	string	true		"the deployment name."
// @Param	statefulset		query 	string	true		"the statefulset name."
// @Success 200 {object} models.Deployment success
// @router /namespaces/:namespace/clusters/:cluster [get]
func (c *KubePodController) List() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	deployment := c.Input().Get("deployment")
	statefulset := c.Input().Get("statefulset")
	daemonSet := c.Input().Get("daemonSet")
	podName := c.Input().Get("pod")
	job := c.Input().Get("job")
	manager, err := client.Manager(cluster)
	if err == nil {
		var result interface{}
		var err error
		if deployment != "" {
			result, err = pod.GetPodsByDeployment(manager.CacheFactory, namespace, deployment)
		} else if statefulset != "" {
			result, err = pod.GetPodsByStatefulset(manager.CacheFactory, namespace, statefulset)
		} else if daemonSet != "" {
			result, err = pod.GetPodsByDaemonSet(manager.CacheFactory, namespace, daemonSet)
		} else if job != "" {
			result, err = pod.GetPodsByJob(manager.CacheFactory, namespace, job)
		} else if podName != "" {
			var podInfo *pod.Pod
			podInfo, err = pod.GetPodByName(manager.Client, namespace, podName)
			result = []*pod.Pod{podInfo}
		} else {
			err = fmt.Errorf("unknown resource type. ")
		}
		if err != nil {
			logs.Error("get kubernetes pod error.", cluster, namespace, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Get
// @Description find Deployment by cluster
// @Success 200 {object} models.Deployment success
// @router /:pod/namespaces/:namespace/clusters/:cluster [get]
func (c *KubePodController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pod")
	cli, err := client.Client(cluster)
	if err == nil {
		result, err := pod.GetPodByName(cli, namespace, name)
		if err != nil {
			logs.Error("get kubernetes pod detail error.", cluster, namespace, name, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Delete
// @Description delete the Pod
// @Param	cluster		path 	string	true		"the cluster want to delete"
// @Param	namespace		path 	string	true		"the namespace want to delete"
// @Param	pod		path 	string	true		"the pod name want to delete"
// @Success 200 {string} delete success!
// @router /:pod/namespaces/:namespace/clusters/:cluster [delete]
func (c *KubePodController) Delete() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pod")
	cli, err := client.Client(cluster)
	if err == nil {
		err := pod.DeletePod(cli, name, namespace)
		if err != nil {
			logs.Error("delete pod (%s) by cluster (%s) error.%v", name, cluster, err)
			c.HandleError(err)
			return
		}
		c.Success("ok!")
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}
