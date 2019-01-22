package hpa

import (
	"encoding/json"
	"fmt"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"

	"k8s.io/api/autoscaling/v1"
)

type HPATplController struct {
	base.APIController
}

func (c *HPATplController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	//c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *HPATplController) Prepare() {
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

// @router / [get]
func (c *HPATplController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	isOnline := c.GetIsOnlineFromQuery()

	hpaId := c.Input().Get("hpaId")
	if hpaId != "" {
		param.Query["hpa_id"] = hpaId
	}

	var hpaTpls []models.HPATemplate
	total, err := models.ListTemplate(&hpaTpls, param, models.TableNameHPATemplate, models.PublishTypeHPA, isOnline)
	if err != nil {
		logs.Error("list by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for index, tpl := range hpaTpls {
		hpaTpls[index].HPAId = tpl.HPA.Id
	}

	c.Success(param.NewPage(total, hpaTpls))
}

// @router / [post]
func (c *HPATplController) Create() {
	var hpaTpl models.HPATemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &hpaTpl)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("HPATemplate")
	}
	err = validHPATemplate(hpaTpl.Template)
	if err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeHPA")
	}

	hpaTpl.User = c.User.Name

	_, err = models.HPATemplateModel.Add(&hpaTpl)
	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(hpaTpl)
}

func validHPATemplate(hpaTplStr string) error {
	hpa := v1.HorizontalPodAutoscaler{}
	err := json.Unmarshal(hack.Slice(hpaTplStr), &hpa)
	if err != nil {
		return fmt.Errorf("hpa template format error.%v", err.Error())
	}
	return nil
}

// @router /:id([0-9]+) [get]
func (c *HPATplController) Get() {
	id := c.GetIDFromURL()

	tpl, err := models.HPATemplateModel.GetById(id)
	if err != nil {
		logs.Error("get template error %v", err)
		c.HandleError(err)
		return
	}

	c.Success(tpl)
}

// @router /:id([0-9]+) [put]
func (c *HPATplController) Update() {
	id := c.GetIDFromURL()
	var tpl models.HPATemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &tpl)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("HPATemplate")
	}
	if err = validHPATemplate(tpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeHPA")
	}

	tpl.Id = int64(id)
	err = models.HPATemplateModel.UpdateById(&tpl)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(tpl)
}

// @router /:id([0-9]+) [delete]
func (c *HPATplController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.HPATemplateModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
