package deployment

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type DeploymentController struct {
	base.APIController
}

func (c *DeploymentController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("UpdateOrders", c.UpdateOrders)
	c.Mapping("Delete", c.Delete)
}

func (c *DeploymentController) Prepare() {
	// Check administration
	c.APIController.Prepare()
	// Check permission
	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Get", "List", "GetNames":
		perAction = models.PermissionRead
	case "Create":
		perAction = models.PermissionCreate
	case "Update":
		perAction = models.PermissionUpdate
	case "Delete":
		perAction = models.PermissionDelete
	}
	if perAction != "" {
		c.CheckPermission(models.PermissionTypeDeployment, perAction)
	}
}

// @Title List/
// @Description get all id and names
// @Param	appId		query 	int	false		"the app id"
// @Param	deleted		query 	bool	false		"is deleted,default false."
// @Success 200 {object} []models.Deployment success
// @router /names [get]
func (c *DeploymentController) GetNames() {
	filters := make(map[string]interface{})
	deleted := c.GetDeleteFromQuery()
	filters["Deleted"] = deleted
	if c.AppId != 0 {
		filters["App__Id"] = c.AppId
	}

	deployments, err := models.DeploymentModel.GetNames(filters)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(deployments)
}

// @Title GetAll
// @Description get all Deployment
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	appId		query 	int	false		"the app id"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted, default list all"
// @Success 200 {object} []models.Deployment success
// @router / [get]
func (c *DeploymentController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	deployment := []models.Deployment{}
	if c.AppId != 0 {
		param.Query["App__Id"] = c.AppId
	} else if !c.User.Admin {
		param.Query["App__AppUsers__User__Id__exact"] = c.User.Id
		perName := models.PermissionModel.MergeName(models.PermissionTypeDeployment, models.PermissionRead)
		param.Query["App__AppUsers__Group__Permissions__Permission__Name__contains"] = perName
		param.Groupby = []string{"Id"}
	}

	total, err := models.GetTotal(new(models.Deployment), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.Deployment), &deployment, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for key, one := range deployment {
		deployment[key].AppId = one.App.Id
	}

	c.Success(param.NewPage(total, deployment))
	return
}

// @Title Create
// @Description create Deployment
// @Param	body		body 	models.Deployment	true		"The Deployment content"
// @Success 200 return models.Deployment success
// @router / [post]
func (c *DeploymentController) Create() {
	var deploy models.Deployment
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &deploy)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("Deployment")
	}

	deploy.User = c.User.Name
	_, err = models.DeploymentModel.Add(&deploy)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(deploy)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.Deployment success
// @router /:id([0-9]+) [get]
func (c *DeploymentController) Get() {
	id := c.GetIDFromURL()

	deploy, err := models.DeploymentModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(deploy)
}

// @Title Update
// @Description update the Deployment
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.Deployment	true		"The body"
// @Success 200 models.Deployment success
// @router /:id([0-9]+) [put]
func (c *DeploymentController) Update() {
	id := c.GetIDFromURL()

	var deploy models.Deployment
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &deploy)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Deployment")
	}

	deploy.Id = int64(id)
	err = models.DeploymentModel.UpdateById(&deploy)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(deploy)
}

// @Title UpdateOrders
// @Description batch update the Orders
// @Param	body		body 	[]models.Deployment	true		"The body"
// @Success 200 models.Deployment success
// @router /updateorders [put]
func (c *DeploymentController) UpdateOrders() {
	var deploys []*models.Deployment
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &deploys)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Deployments")
	}

	err = models.DeploymentModel.UpdateOrders(deploys)
	if err != nil {
		logs.Error("update orders (%v) error.%v", deploys, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}

// @Title Delete
// @Description delete the Deployment
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id([0-9]+) [delete]
func (c *DeploymentController) Delete() {
	id := c.GetIDFromURL()

	logical := c.GetLogicalFromQuery()

	err := models.DeploymentModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
