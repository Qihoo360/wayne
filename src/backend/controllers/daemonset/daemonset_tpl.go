package daemonset

import (
	"encoding/json"
	"fmt"

	"k8s.io/api/extensions/v1beta1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type DaemonSetTplController struct {
	base.APIController
}

func (c *DaemonSetTplController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *DaemonSetTplController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeDaemonSet, perAction)
	}
}

// @Title GetAll
// @Description get all DaemonSetTemplate
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	daemonSetId		query 	int	false		"daemonSet id"
// @Param	isOnline		query 	bool	false		"only show online tpls,default false"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted"
// @Success 200 {object} []models.DaemonSetTemplate success
// @router / [get]
func (c *DaemonSetTplController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}
	isOnline := c.GetIsOnlineFromQuery()

	daemonSetId := c.Input().Get("daemonSetId")
	if daemonSetId != "" {
		param.Query["daemon_set_id"] = daemonSetId
	}
	var tpls []models.DaemonSetTemplate
	total, err := models.ListTemplate(&tpls, param, models.TableNameDaemonSetTemplate, models.PublishTypeDaemonSet, isOnline)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for index, tpl := range tpls {
		tpls[index].DaemonSetId = tpl.DaemonSet.Id
	}

	c.Success(param.NewPage(total, tpls))
	return
}

// @Title Create
// @Description create DaemonSetTemplate
// @Param	body		body 	models.DaemonSetTemplate	true		"The DaemonSetTemplate content"
// @Success 200 return models.DaemonSetTemplate success
// @router / [post]
func (c *DaemonSetTplController) Create() {
	var tpl models.DaemonSetTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &tpl)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("DaemonSetTemplate")
	}
	if err = validDaemonSetTemplate(tpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeDaemonSet")
	}

	tpl.User = c.User.Name
	_, err = models.DaemonSetTplModel.Add(&tpl)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(tpl)
}

func validDaemonSetTemplate(tpl string) error {
	daemonSet := v1beta1.DaemonSet{}
	err := json.Unmarshal(hack.Slice(tpl), &daemonSet)
	if err != nil {
		return fmt.Errorf("daemonSet template format error.%v", err.Error())
	}
	return nil
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.DaemonSetTemplate success
// @router /:id([0-9]+) [get]
func (c *DaemonSetTplController) Get() {
	id := c.GetIDFromURL()

	tpl, err := models.DaemonSetTplModel.GetById(int64(id))
	if err != nil {
		logs.Error("get template error %v", err)
		c.HandleError(err)
		return
	}

	c.Success(tpl)
	return
}

// @Title Update
// @Description update the DaemonSetTemplate
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.DaemonSetTemplate	true		"The body"
// @Success 200 models.DaemonSetTemplate success
// @router /:id [put]
func (c *DaemonSetTplController) Update() {
	id := c.GetIDFromURL()

	var tpl models.DaemonSetTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &tpl)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("DaemonSetTemplate")
	}
	if err = validDaemonSetTemplate(tpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeDaemonSet")
	}

	tpl.Id = int64(id)
	err = models.DaemonSetTplModel.UpdateById(&tpl)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(tpl)
}

// @Title Delete
// @Description delete the DaemonSetTemplate
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *DaemonSetTplController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.DaemonSetTplModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
