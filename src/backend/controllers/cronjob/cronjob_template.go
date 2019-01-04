package cronjob

import (
	"encoding/json"
	"fmt"

	"k8s.io/api/batch/v2alpha1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type CronjobTplController struct {
	base.APIController
}

func (c *CronjobTplController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *CronjobTplController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeCronjob, perAction)
	}
}

// @Title GetAll
// @Description get all CronjobTemplate
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted"
// @Success 200 {object} []models.CronjobTemplate success
// @router / [get]
func (c *CronjobTplController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	isOnline := c.GetIsOnlineFromQuery()

	cronjobId := c.Input().Get("cId")
	if cronjobId != "" {
		param.Query["cronjob_id"] = cronjobId
	}

	var cronjobTpls []models.CronjobTemplate
	total, err := models.ListTemplate(&cronjobTpls, param, models.TableNameCronjobTemplate, models.PublishTypeCronJob, isOnline)
	if err != nil {
		logs.Error("list by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for index, tpl := range cronjobTpls {
		cronjobTpls[index].CronjobId = tpl.Cronjob.Id
	}

	c.Success(param.NewPage(total, cronjobTpls))
	return
}

// @Title Create
// @Description create CronjobTemplate
// @Param	body		body 	models.CronjobTemplate	true		"The CronjobTemplate content"
// @Success 200 return models.CronjobTemplate success
// @router / [post]
func (c *CronjobTplController) Create() {
	var cronjobTpl models.CronjobTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &cronjobTpl)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("CronjobTemplate")
	}
	if err = validCronjobTemplate(cronjobTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeCronjob")
	}

	cronjobTpl.User = c.User.Name
	_, err = models.CronjobTplModel.Add(&cronjobTpl)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(cronjobTpl)
}

func validCronjobTemplate(templateStr string) error {
	cronjobTpl := v2alpha1.CronJob{}
	err := json.Unmarshal(hack.Slice(templateStr), &cronjobTpl)
	if err != nil {
		return fmt.Errorf("cronjobTpl template format error.%v", err.Error())
	}
	return nil
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.CronjobTemplate success
// @router /:id([0-9]+) [get]
func (c *CronjobTplController) Get() {
	id := c.GetIDFromURL()

	cronjobTpl, err := models.CronjobTplModel.GetById(int64(id))
	if err != nil {
		logs.Error("get template error %v", err)
		c.HandleError(err)
		return
	}

	c.Success(cronjobTpl)
	return
}

// @Title Update
// @Description update the CronjobTemplate
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.CronjobTemplate	true		"The body"
// @Success 200 models.CronjobTemplate success
// @router /:id [put]
func (c *CronjobTplController) Update() {
	id := c.GetIDFromURL()
	var cronjobTpl models.CronjobTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &cronjobTpl)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("CronjobTemplate")
	}
	if err = validCronjobTemplate(cronjobTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("kubeCronjob")
	}

	cronjobTpl.Id = int64(id)
	err = models.CronjobTplModel.UpdateById(&cronjobTpl)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(cronjobTpl)
}

// @Title Delete
// @Description delete the CronjobTemplate
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *CronjobTplController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.CronjobTplModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
