package hpa

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type HPAController struct {
	base.APIController
}

func (c *HPAController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
	c.Mapping("UpdateOrders", c.UpdateOrders)
}

func (c *HPAController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeHPA, perAction)
	}
}

// @router /names [get]
func (c *HPAController) GetNames() {
	filters := make(map[string]interface{})
	deleted := c.GetDeleteFromQuery()
	filters["Deleted"] = deleted
	if c.AppId != 0 {
		filters["App__Id"] = c.AppId
	}

	hpas, err := models.HPAModel.GetNames(filters)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(hpas)
}

// @router / [get]
func (c *HPAController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	hpas := []models.HPA{}
	if c.AppId != 0 {
		param.Query["App__Id"] = c.AppId
	} else if !c.User.Admin {
		param.Query["App__AppUsers__User__Id__exact"] = c.User.Id
		perName := models.PermissionModel.MergeName(models.PermissionTypeHPA, models.PermissionRead)
		param.Query["App__AppUsers__Group__Permissions__Permission__Name__contains"] = perName
		param.Groupby = []string{"Id"}
	}

	total, err := models.GetTotal(new(models.HPA), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.HPA), &hpas, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for key, one := range hpas {
		hpas[key].AppId = one.App.Id
	}

	c.Success(param.NewPage(total, hpas))
}

// @router / [post]
func (c *HPAController) Create() {
	var hpa models.HPA
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &hpa)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("HPA")
	}

	hpa.User = c.User.Name
	_, err = models.HPAModel.Add(&hpa)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(hpa)
}

// @router /:id([0-9]+) [get]
func (c *HPAController) Get() {
	id := c.GetIDFromURL()

	hpa, err := models.HPAModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(hpa)
}

// @router /:id([0-9]+) [put]
func (c *HPAController) Update() {
	id := c.GetIDFromURL()
	var hpa models.HPA
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &hpa)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("HPA")
	}

	hpa.Id = int64(id)
	err = models.HPAModel.UpdateById(&hpa)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(hpa)
}

// @router /updateorders [put]
func (c *HPAController) UpdateOrders() {
	var hpas []*models.HPA
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &hpas)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("HPA")
	}

	err = models.HPAModel.UpdateOrders(hpas)
	if err != nil {
		logs.Error("update orders (%v) error.%v", hpas, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}

// @router /:id([0-9]+) [delete]
func (c *HPAController) Delete() {
	id := c.GetIDFromURL()

	logical := c.GetLogicalFromQuery()

	err := models.HPAModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
