package node

import (
	"encoding/json"
	"sync"

	"k8s.io/api/core/v1"
	utilerrors "k8s.io/apimachinery/pkg/util/errors"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/node"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubeNodeController struct {
	base.APIController
}

func (c *KubeNodeController) URLMapping() {
	c.Mapping("NodeStatistics", c.NodeStatistics)
	c.Mapping("List", c.List)
	c.Mapping("Update", c.Update)
	c.Mapping("Get", c.Get)
	c.Mapping("Delete", c.Delete)
}

func (c *KubeNodeController) Prepare() {
	// Check administration
	c.APIController.Prepare()
	methodActionMap := map[string]string{
		"NodeStatistics": models.PermissionRead,
		"List":           models.PermissionRead,
		"Get":            models.PermissionRead,
		"Update":         models.PermissionUpdate,
		"Delete":         models.PermissionDelete,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeNode)
}

// @Title kubernetes node statistics
// @Description kubernetes statistics
// @Param	cluster	query 	string	false		"the cluster "
// @Success 200 {object} node.NodeStatistics success
// @router /statistics [get]
func (c *KubeNodeController) NodeStatistics() {
	cluster := c.Input().Get("cluster")
	total := 0
	countSyncMap := sync.Map{}
	countMap := make(map[string]int)
	if cluster == "" {
		managers := client.Managers()
		var errs []error
		wg := sync.WaitGroup{}

		managers.Range(func(key, value interface{}) bool {
			manager := value.(*client.ClusterManager)
			clu := key.(string)
			wg.Add(1)
			go func(clu string, mang *client.ClusterManager) {
				defer wg.Done()
				count, err := node.GetNodeCounts(mang.CacheFactory)
				if err != nil {
					logs.Error("get k8s nodes count error. %v", err.Error())
					errs = append(errs, err)
				}
				total += count
				countSyncMap.Store(clu, count)
			}(clu, manager)
			return true
		})

		wg.Wait()
		if len(errs) > 0 {
			c.HandleError(utilerrors.NewAggregate(errs))
			return
		}
		countSyncMap.Range(func(key, value interface{}) bool {
			countMap[key.(string)] = value.(int)
			return true
		})
	} else {
		manager, err := client.Manager(cluster)
		if err == nil {
			count, err := node.GetNodeCounts(manager.CacheFactory)
			if err != nil {
				logs.Error("get k8s nodes count error. %v", err.Error())
				c.HandleError(err)
				return
			}
			total += count
		} else {
			c.AbortBadRequest("Cluster")
		}

	}

	c.Success(node.NodeStatistics{Total: total, Details: countMap})
}

// @Title List node
// @Description list nodes
// @router /clusters/:cluster [get]
func (c *KubeNodeController) List() {
	cluster := c.Ctx.Input.Param(":cluster")
	manager := c.Manager(cluster)
	result, err := node.ListNode(manager.CacheFactory)
	if err != nil {
		logs.Error("list node by cluster (%s) error.%v", cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title get node
// @Description find node by cluster
// @router /:name/clusters/:cluster [get]
func (c *KubeNodeController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)

	result, err := node.GetNodeByName(cli, name)
	if err != nil {
		logs.Error("get node by cluster (%s) name(%s) error.%v", cluster, name, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Update
// @Description update the Node
// @router /:name/clusters/:cluster [put]
func (c *KubeNodeController) Update() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	var tpl v1.Node
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &tpl)
	if err != nil {
		c.AbortBadRequestFormat("Node")
	}
	if name != tpl.Name {
		c.AbortBadRequestFormat("Name")
	}

	cli := c.Client(cluster)
	result, err := node.UpdateNode(cli, &tpl)
	if err != nil {
		logs.Error("update node (%v) by cluster (%s) error.%v", tpl, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Delete
// @Description delete the Node
// @Success 200 {string} delete success!
// @router /:name/clusters/:cluster [delete]
func (c *KubeNodeController) Delete() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)
	err := node.DeleteNode(cli, name)
	if err != nil {
		logs.Error("delete node (%s) by cluster (%s) error.%v", name, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}
