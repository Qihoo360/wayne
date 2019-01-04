package statefulset

import (
	"encoding/json"
	"fmt"

	"k8s.io/api/apps/v1beta1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type StatefulsetTplController struct {
	base.APIController
}

func (c *StatefulsetTplController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *StatefulsetTplController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeStatefulset, perAction)
	}
}

// @Title GetAll
// @Description get all StatefulsetTemplate
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	statefulsetId		query 	int	false		"statefulset id"
// @Param	isOnline		query 	bool	false		"only show online tpls,default false"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted"
// @Success 200 {object} []models.StatefulsetTemplate success
// @router / [get]
func (c *StatefulsetTplController) List() {
	param := c.BuildQueryParam()

	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}
	isOnline := c.GetIsOnlineFromQuery()

	statefulsetId := c.Input().Get("statefulsetId")
	if statefulsetId != "" {
		param.Query["statefulset_id"] = statefulsetId
	}
	var tpls []models.StatefulsetTemplate
	total, err := models.ListTemplate(&tpls, param, models.TableNameStatefulsetTemplate, models.PublishTypeStatefulSet, isOnline)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for index, tpl := range tpls {
		tpls[index].StatefulsetId = tpl.Statefulset.Id
	}

	c.Success(param.NewPage(total, tpls))
}

// @Title Create
// @Description create StatefulsetTemplate
// @Param	body		body 	models.StatefulsetTemplate	true		"The StatefulsetTemplate content"
// @Success 200 return models.StatefulsetTemplate success
// @router / [post]
func (c *StatefulsetTplController) Create() {
	var statefulsetTpl models.StatefulsetTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &statefulsetTpl)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("StatefulsetTemplate")
	}
	if err = validStatefulsetTemplate(statefulsetTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeStatefulset")
	}

	statefulsetTpl.User = c.User.Name
	_, err = models.StatefulsetTplModel.Add(&statefulsetTpl)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(statefulsetTpl)
}

func validStatefulsetTemplate(tpl string) error {
	statefulset := v1beta1.StatefulSet{}
	err := json.Unmarshal(hack.Slice(tpl), &statefulset)
	if err != nil {
		return fmt.Errorf("statefulset template format error.%v", err.Error())
	}
	return nil
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.StatefulsetTemplate success
// @router /:id([0-9]+) [get]
func (c *StatefulsetTplController) Get() {
	id := c.GetIDFromURL()

	statefulsetTpl, err := models.StatefulsetTplModel.GetById(int64(id))
	if err != nil {
		logs.Error("get template error %v", err)
		c.HandleError(err)
		return
	}

	c.Success(statefulsetTpl)
}

// @Title Update
// @Description update the StatefulsetTemplate
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.StatefulsetTemplate	true		"The body"
// @Success 200 models.StatefulsetTemplate success
// @router /:id [put]
func (c *StatefulsetTplController) Update() {
	id := c.GetIDFromURL()

	var statefulsetTpl models.StatefulsetTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &statefulsetTpl)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("StatefulsetTemplate")
	}
	if err = validStatefulsetTemplate(statefulsetTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeStatefulset")
	}

	statefulsetTpl.Id = int64(id)
	err = models.StatefulsetTplModel.UpdateById(&statefulsetTpl)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(statefulsetTpl)
}

// @Title Delete
// @Description delete the StatefulsetTemplate
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *StatefulsetTplController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.StatefulsetTplModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
