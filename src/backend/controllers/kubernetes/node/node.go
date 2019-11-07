package node

import (
	"encoding/json"
	"sync"

	v1 "k8s.io/api/core/v1"
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

type Label struct {
	Key   string `json:"key,omitempty"`
	Value string `json:"value,omitempty"`
}

type LabelSet struct {
	Labels []Label
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

// @Title list node labels
// @Description get labels of a node
// @router /:name/clusters/:cluster/labels [get]
func (c *KubeNodeController) GetLabels() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)

	result, err := node.GetNodeByName(cli, name)
	if err != nil {
		logs.Error("get node by cluster (%s) name(%s) error.%v", cluster, name, err)
		c.HandleError(err)
		return
	}
	labels := result.ObjectMeta.Labels

	c.Success(labels)
}

// @Title add label
// @Description add a label for a node
// @router /:name/clusters/:cluster/label [post]
func (c *KubeNodeController) AddLabel() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)
	var label Label
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &label)
	if err != nil {
		c.AbortBadRequestFormat("label")
	}

	nodeInfo, err := node.GetNodeByName(cli, name)
	if err != nil {
		logs.Error("get node by cluster (%s) name(%s) error.%v", cluster, name, err)
		c.HandleError(err)
		return
	}
	if len(nodeInfo.ObjectMeta.Labels) == 0 {
		nodeInfo.ObjectMeta.Labels = map[string]string{label.Key: label.Value}
	} else {
		nodeInfo.ObjectMeta.Labels[label.Key] = label.Value
	}

	newNode, err := node.UpdateNode(cli, nodeInfo)
	if err != nil {
		logs.Error("update node (%v) by cluster (%s) error.%v", *nodeInfo, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(newNode)
}

// @Title delete label
// @Description delete a label of the node
// @router /:name/clusters/:cluster/label [delete]
func (c *KubeNodeController) DeleteLabel() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)
	var label Label
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &label)
	if err != nil {
		logs.Error("unmarshal err:(%s)", err)
		c.AbortBadRequestFormat("label")
	}

	nodeInfo, err := node.GetNodeByName(cli, name)
	if err != nil {
		logs.Error("get node by cluster (%s) name(%s) error.%v", cluster, name, err)
		c.HandleError(err)
		return
	}
	if _, ok := nodeInfo.ObjectMeta.Labels[label.Key]; ok {
		delete(nodeInfo.ObjectMeta.Labels, label.Key)
	} else {
		logs.Error("delete failed use the label key:(%s)", label.Key)
		return
	}

	newNode, err := node.UpdateNode(cli, nodeInfo)
	if err != nil {
		logs.Error("update node (%v) by cluster (%s) error.%v", *nodeInfo, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(newNode)
}

// @Title add labels
// @Description Add labels in bulk for node
// @router /:name/clusters/:cluster/labels [post]
func (c *KubeNodeController) AddLabels() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)
	var labels LabelSet
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &labels)
	if err != nil {
		logs.Error("unmarshal err:(%s)", err)
		c.AbortBadRequestFormat("label")
	}

	result, err := node.GetNodeByName(cli, name)
	if err != nil {
		logs.Error("get node by cluster (%s) name(%s) error.%v", cluster, name, err)
		c.HandleError(err)
		return
	}
	if len(result.ObjectMeta.Labels) == 0 {
		result.ObjectMeta.Labels = make(map[string]string)
	}

	for _, label := range labels.Labels {
		result.ObjectMeta.Labels[label.Key] = label.Value
	}

	newNode, err := node.UpdateNode(cli, result)
	if err != nil {
		logs.Error("update node (%v) by cluster (%s) error.%v", *result, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(newNode)
}

// @Title delete labels
// @Description Delete node labels in batches
// @router /:name/clusters/:cluster/labels [delete]
func (c *KubeNodeController) DeleteLabels() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)
	var labels LabelSet
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &labels)
	if err != nil {
		logs.Error("unmarshal err:(%s)", err)
		c.AbortBadRequestFormat("label")
	}

	result, err := node.GetNodeByName(cli, name)
	if err != nil {
		logs.Error("get node by cluster (%s) name(%s) error.%v", cluster, name, err)
		c.HandleError(err)
		return
	}
	for _, label := range labels.Labels {
		if _, ok := result.ObjectMeta.Labels[label.Key]; ok {
			delete(result.ObjectMeta.Labels, label.Key)
		} else {
			logs.Error("delete failed use the label key:(%s)", label.Key)
			return
		}
	}

	newNode, err := node.UpdateNode(cli, result)
	if err != nil {
		logs.Error("update node (%v) by cluster (%s) error.%v", *result, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(newNode)
}

// @Title add taint
// @Description set taint for a node
// @router /:name/clusters/:cluster/taint [post]
func (c *KubeNodeController) SetTaint() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)

	var taint v1.Taint
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &taint)
	if err != nil {
		logs.Error("unmarshal err:(%s)", err)
		c.AbortBadRequestFormat("taint")
	}

	result, err := node.GetNodeByName(cli, name)
	if err != nil {
		logs.Error("get node by cluster (%s) name(%s) error.%v", cluster, name, err)
		c.HandleError(err)
		return
	}
	taints := result.Spec.Taints
	if len(taints) == 0 {
		taints = []v1.Taint{}
		taints = append(taints, taint)
	} else {
		taints = append(taints, taint)
	}
	result.Spec.Taints = taints

	newNode, err := node.UpdateNode(cli, result)
	if err != nil {
		logs.Error("update node (%v) by cluster (%s) error.%v", *result, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(newNode)
}

// @Title delete taint
// @Description delete a taint from node
// @router /:name/clusters/:cluster/taint [delete]
func (c *KubeNodeController) DeleteTaint() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)

	var taint v1.Taint
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &taint)
	if err != nil {
		logs.Error("unmarshal err:(%s)", err)
		c.AbortBadRequestFormat("taint")
	}

	result, err := node.GetNodeByName(cli, name)
	if err != nil {
		logs.Error("get node by cluster (%s) name(%s) error.%v", cluster, name, err)
		c.HandleError(err)
		return
	}
	taints := result.Spec.Taints
	if len(taints) == 0 {
		logs.Error("delete failed,the taint does not exist ")
		return
	}
	newTaints := []v1.Taint{}
	for _, t := range taints {
		if t.Key != taint.Key || t.Value != taint.Value || t.Effect != taint.Effect {
			newTaints = append(newTaints, t)
		}
	}
	result.Spec.Taints = newTaints

	newNode, err := node.UpdateNode(cli, result)
	if err != nil {
		logs.Error("update node (%v) by cluster (%s) error.%v", *result, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(newNode)
}
