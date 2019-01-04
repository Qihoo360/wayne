package deployment

import (
	"encoding/json"
	"fmt"

	"k8s.io/api/apps/v1beta1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type DeploymentTplController struct {
	base.APIController
}

func (c *DeploymentTplController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *DeploymentTplController) Prepare() {
	// Check administration
	c.APIController.Prepare()
	// Check permission
	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Get", "List":
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

// @Title GetAll
// @Description get all DeploymentTemplate
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	deploymentId		query 	int	false		"deployment id"
// @Param	isOnline		query 	bool	false		"only show online tpls,default false"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted"
// @Success 200 {object} []models.DeploymentTemplate success
// @router / [get]
func (c *DeploymentTplController) List() {
	param := c.BuildQueryParam()

	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}
	isOnline := c.GetIsOnlineFromQuery()

	deploymentId := c.Input().Get("deploymentId")
	if deploymentId != "" {
		param.Query["deployment_id"] = deploymentId
	}
	var deploymentTpls []models.DeploymentTemplate
	total, err := models.ListTemplate(&deploymentTpls, param, models.TableNameDeploymentTemplate, models.PublishTypeDeployment, isOnline)
	if err != nil {
		logs.Error("list by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for index, tpl := range deploymentTpls {
		deploymentTpls[index].DeploymentId = tpl.Deployment.Id
	}

	c.Success(param.NewPage(total, deploymentTpls))
	return
}

// @Title Create
// @Description create DeploymentTemplate
// @Param	body		body 	models.DeploymentTemplate	true		"The DeploymentTemplate content"
// @Success 200 return models.DeploymentTemplate success
// @router / [post]
func (c *DeploymentTplController) Create() {
	var deployTpl models.DeploymentTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &deployTpl)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("DeploymentTemplate")
	}
	if err = validDeploymentTemplate(deployTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeDeployment")
	}

	deployTpl.User = c.User.Name
	_, err = models.DeploymentTplModel.Add(&deployTpl)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(deployTpl)
}

func validDeploymentTemplate(deployStr string) error {
	deployment := v1beta1.Deployment{}
	err := json.Unmarshal(hack.Slice(deployStr), &deployment)
	if err != nil {
		return fmt.Errorf("deployment template format error.%v", err.Error())
	}
	return nil
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.DeploymentTemplate success
// @router /:id([0-9]+) [get]
func (c *DeploymentTplController) Get() {
	id := c.GetIDFromURL()

	deployTpl, err := models.DeploymentTplModel.GetById(int64(id))
	if err != nil {
		logs.Error("get template error %v", err)
		c.HandleError(err)
		return
	}

	c.Success(deployTpl)
	return
}

// @Title Update
// @Description update the DeploymentTemplate
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.DeploymentTemplate	true		"The body"
// @Success 200 models.DeploymentTemplate success
// @router /:id [put]
func (c *DeploymentTplController) Update() {
	id := c.GetIDFromURL()

	var deployTpl models.DeploymentTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &deployTpl)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("DeploymentTemplate")
	}
	if err = validDeploymentTemplate(deployTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeDeployment")
	}

	deployTpl.Id = int64(id)
	err = models.DeploymentTplModel.UpdateById(&deployTpl)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(deployTpl)
}

// @Title Delete
// @Description delete the DeploymentTemplate
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *DeploymentTplController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.DeploymentTplModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
