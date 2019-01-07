package ingress

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type IngressController struct {
	base.APIController
}

func (c *IngressController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
	c.Mapping("UpdateOrders", c.UpdateOrders)
}

func (c *IngressController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeIngress, perAction)
	}
}

// @router /names [get]
func (c *IngressController) GetNames() {
	filters := make(map[string]interface{})
	deleted := c.GetDeleteFromQuery()

	filters["Deleted"] = deleted
	if c.AppId != 0 {
		filters["App__Id"] = c.AppId
	}

	ingresses, err := models.IngressModel.GetNames(filters)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(ingresses)
}

// @router / [get]
func (c *IngressController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	ingrs := []models.Ingress{}
	if c.AppId != 0 {
		param.Query["App__Id"] = c.AppId
	} else if !c.User.Admin {
		param.Query["App__AppUsers__User__Id__exact"] = c.User.Id
		perName := models.PermissionModel.MergeName(models.PermissionTypeIngress, models.PermissionRead)
		param.Query["App__AppUsers__Group__Permissions__Permission__Name__contains"] = perName
		param.Groupby = []string{"Id"}
	}

	total, err := models.GetTotal(new(models.Ingress), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.Ingress), &ingrs, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for key, one := range ingrs {
		ingrs[key].AppId = one.App.Id
	}

	c.Success(param.NewPage(total, ingrs))
}

// @router / [post]
func (c *IngressController) Create() {
	var ingr models.Ingress
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &ingr)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("Ingress")
	}

	ingr.User = c.User.Name
	_, err = models.IngressModel.Add(&ingr)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(ingr)
}

// @router /:id([0-9]+) [get]
func (c *IngressController) Get() {
	id := c.GetIDFromURL()

	ingr, err := models.IngressModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(ingr)
	return
}

// @router /:id([0-9]+) [put]
func (c *IngressController) Update() {
	id := c.GetIDFromURL()
	var ingr models.Ingress
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &ingr)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Ingress")
	}

	ingr.Id = int64(id)
	err = models.IngressModel.UpdateById(&ingr)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(ingr)
}

// @router /updateorders [put]
func (c *IngressController) UpdateOrders() {
	var ingr []*models.Ingress
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &ingr)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Ingress")
	}

	err = models.IngressModel.UpdateOrders(ingr)
	if err != nil {
		logs.Error("update orders (%v) error.%v", ingr, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}

// @router /:id([0-9]+) [delete]
func (c *IngressController) Delete() {
	id := c.GetIDFromURL()

	logical := c.GetLogicalFromQuery()

	err := models.IngressModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
