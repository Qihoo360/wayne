package cluster

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

// 集群相关操作
type ClusterController struct {
	base.APIController
}

func (c *ClusterController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *ClusterController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	// Check permission
	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Create":
		perAction = models.PermissionCreate
	case "Update":
		perAction = models.PermissionUpdate
	case "Delete":
		perAction = models.PermissionDelete
	}
	if perAction != "" && !c.User.Admin {
		c.AbortForbidden("operation need admin permission.")
	}
}

// @Title List/
// @Description get all id and names
// @Param	deleted		query 	bool	false		"is deleted,default false."
// @Success 200 {object} []models.Cluster success
// @router /names [get]
func (c *ClusterController) GetNames() {
	deleted := c.GetDeleteFromQuery()

	services, err := models.ClusterModel.GetNames(deleted)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(services)
}

// @Title Create
// @Description create Cluster
// @Param	body		body 	models.Cluster	true		"The app content"
// @Success 200 return id success
// @Failure 403 body is empty
// @router / [post]
func (c *ClusterController) Create() {
	var cluster models.Cluster
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &cluster)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("Cluster")
	}
	cluster.User = c.User.Name

	objectid, err := models.ClusterModel.Add(&cluster)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(objectid)
}

// @Title Update
// @Description update the object
// @Param	name		path 	string	true		"The name you want to update"
// @Param	body		body 	models.Cluster	true		"The body"
// @Success 200 id success
// @Failure 403 :name is empty
// @router /:name [put]
func (c *ClusterController) Update() {
	name := c.Ctx.Input.Param(":name")

	var cluster models.Cluster
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &cluster)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Cluster")
	}
	cluster.Name = name
	err = models.ClusterModel.UpdateByName(&cluster)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(cluster)
}

// @Title Get
// @Description find Object by objectid
// @Param	name		path 	string	true		"the name you want to get"
// @Success 200 {object} models.Cluster success
// @Failure 403 :name is empty
// @router /:name [get]
func (c *ClusterController) Get() {
	name := c.Ctx.Input.Param(":name")

	cluster, err := models.ClusterModel.GetByName(name)
	if err != nil {
		logs.Error("get error.%v", err)
		c.HandleError(err)
		return
	}
	// 非admin用户不允许查看kubeconfig配置
	if !c.User.Admin {
		cluster.KubeConfig = ""
	}
	c.Success(cluster)
}

// @Title List
// @Description get all objects
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Success 200 {object} []models.Cluster success
// @router / [get]
func (c *ClusterController) List() {
	param := c.BuildQueryParam()
	clusters := []models.Cluster{}

	total, err := models.GetTotal(new(models.Cluster), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	err = models.GetAll(new(models.Cluster), &clusters, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	// 非admin用户不允许查看kubeconfig配置
	if !c.User.Admin {
		for i := range clusters {
			clusters[i].KubeConfig = ""
		}
	}

	c.Success(param.NewPage(total, clusters))
	return
}

// @Title Delete
// @Description delete the app
// @Param	name		path 	string	true		"The name you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @Failure 403 name is empty
// @router /:name [delete]
func (c *ClusterController) Delete() {
	name := c.Ctx.Input.Param(":name")

	logical := c.GetLogicalFromQuery()

	err := models.ClusterModel.DeleteByName(name, logical)
	if err != nil {
		logs.Error("delete error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
