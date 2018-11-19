package permission

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type PermissionController struct {
	base.APIController
}

func (c *PermissionController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Get", c.Get)
	c.Mapping("Create", c.Create)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *PermissionController) Prepare() {
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

// @Title GetAll
// @Description get all permission
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Success 200 {object} []models.Permission success
// @router / [get]
func (c *PermissionController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	total, err := models.GetTotal(new(models.Permission), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	permissions := []models.Permission{}
	err = models.GetAll(new(models.Permission), &permissions, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	c.Success(param.NewPage(total, permissions))
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.Permission success
// @router /:id [get]
func (c *PermissionController) Get() {
	id := c.GetIDFromURL()

	permissions, err := models.PermissionModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(permissions)
}

// @Title Create
// @Description create permission
// @Param	body		body 	models.Permission	true		"The permission content"
// @Success 200 return models.Permission success
// @router / [post]
func (c *PermissionController) Create() {
	var permission models.Permission
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &permission)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("Permission")
		return
	}
	_, err = models.PermissionModel.Add(&permission)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(permission)
}

// @Title Update
// @Description update the permission
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.Permission	true		"The body"
// @Success 200 models.Permission success
// @router /:id [put]
func (c *PermissionController) Update() {
	var permission *models.Permission
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &permission)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Permission")
		return
	}

	id := c.GetIDFromURL()
	permission.Id = int64(id)

	err = models.PermissionModel.UpdateById(permission)
	if err != nil {
		c.HandleError(err)
		return
	}

	c.Success(permission)
}

// @Title Delete
// @Description delete the Permission
// @Param	id		path 	int	true		"The id you want to delete"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *PermissionController) Delete() {
	id := c.GetIDFromURL()

	err := models.PermissionModel.Delete(int64(id))
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(nil)
}
