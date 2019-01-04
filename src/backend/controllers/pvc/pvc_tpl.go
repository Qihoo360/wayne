package pvc

import (
	"encoding/json"
	"fmt"

	"k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type PersistentVolumeClaimTplController struct {
	base.APIController
}

func (c *PersistentVolumeClaimTplController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *PersistentVolumeClaimTplController) Prepare() {
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
		c.CheckPermission(models.PermissionTypePersistentVolumeClaim, perAction)
	}
}

// @Title GetAll
// @Description get all PersistentVolumeClaimTemplate
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted"
// @Success 200 {object} []models.PersistentVolumeClaimTemplate success
// @router / [get]
func (c *PersistentVolumeClaimTplController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	isOnline := c.GetIsOnlineFromQuery()

	pvcId := c.Input().Get("pvcId")
	if pvcId != "" {
		param.Query["persistent_volume_claim_id"] = pvcId
	}

	var tpls []models.PersistentVolumeClaimTemplate
	total, err := models.ListTemplate(&tpls, param, models.TableNamePersistentVolumeClaimTemplate, models.PublishTypePersistentVolumeClaim, isOnline)
	if err != nil {
		logs.Error("list by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for index, tpl := range tpls {
		tpls[index].PersistentVolumeClaimId = tpl.PersistentVolumeClaim.Id
	}

	c.Success(param.NewPage(total, tpls))
}

// @Title Create
// @Description create PersistentVolumeClaimTemplate
// @Param	body		body 	models.PersistentVolumeClaimTemplate	true		"The PersistentVolumeClaimTemplate content"
// @Success 200 return models.PersistentVolumeClaimTemplate success
// @router / [post]
func (c *PersistentVolumeClaimTplController) Create() {
	var tpl models.PersistentVolumeClaimTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &tpl)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("PersistentVolumeClaimTemplate")
	}
	if err = validPersistentVolumeClaimTemplate(tpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubePersistentVolumeClaimTemplate")
	}

	tpl.User = c.User.Name
	_, err = models.PersistentVolumeClaimTplModel.Add(&tpl)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(tpl)
}

func validPersistentVolumeClaimTemplate(templateStr string) error {
	tpl := v1.PersistentVolumeClaim{}
	err := json.Unmarshal(hack.Slice(templateStr), &tpl)
	if err != nil {
		return fmt.Errorf("tpl template format error.%v", err.Error())
	}
	return nil
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.PersistentVolumeClaimTemplate success
// @router /:id([0-9]+) [get]
func (c *PersistentVolumeClaimTplController) Get() {
	id := c.GetIDFromURL()

	tpl, err := models.PersistentVolumeClaimTplModel.GetById(int64(id))
	if err != nil {
		logs.Error("get template error %v", err)
		c.HandleError(err)
		return
	}

	c.Success(tpl)
}

// @Title Update
// @Description update the PersistentVolumeClaimTemplate
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.PersistentVolumeClaimTemplate	true		"The body"
// @Success 200 models.PersistentVolumeClaimTemplate success
// @router /:id [put]
func (c *PersistentVolumeClaimTplController) Update() {
	id := c.GetIDFromURL()
	var tpl models.PersistentVolumeClaimTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &tpl)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("PersistentVolumeClaimTpl")
	}
	if err = validPersistentVolumeClaimTemplate(tpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubePersistentVolumeClaimTpl")
	}

	tpl.Id = int64(id)
	err = models.PersistentVolumeClaimTplModel.UpdateById(&tpl)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(tpl)
}

// @Title Delete
// @Description delete the PersistentVolumeClaimTemplate
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *PersistentVolumeClaimTplController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.PersistentVolumeClaimTplModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
