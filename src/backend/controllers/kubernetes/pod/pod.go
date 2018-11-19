package pod

import (
	"fmt"
	"sync"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
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
		for _, manager := range managers {
			wg.Add(1)
			go func(manager *client.ClusterManager) {
				defer wg.Done()
				count := pod.GetPodCounts(manager.Indexer)
				total += count
				countSyncMap.Store(manager.Cluster.Name, count)
			}(manager)
		}
		wg.Wait()
		countSyncMap.Range(func(key, value interface{}) bool {
			countMap[key.(string)] = value.(int)
			return true
		})

	} else {
		manager, err := client.Manager(cluster)
		if err == nil {
			count := pod.GetPodCounts(manager.Indexer)
			total += count
		} else {
			c.HandleError(err)
			return
		}

	}

	c.Success(pod.PodStatistics{Total: total, Details: countMap})
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
	job := c.Input().Get("job")
	cli, err := client.Client(cluster)
	if err == nil {
		var result interface{}
		var err error
		if deployment != "" {
			result, err = pod.GetPodsByDeployment(cli, namespace, deployment)
		} else if statefulset != "" {
			result, err = pod.GetPodsByStatefulset(cli, namespace, statefulset)
		} else if daemonSet != "" {
			result, err = pod.GetPodsByDaemonSet(cli, namespace, daemonSet)
		} else if job != "" {
			result, err = pod.GetPodsByJob(cli, namespace, job)
		} else {
			err = fmt.Errorf("unkown resource type. ")
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
