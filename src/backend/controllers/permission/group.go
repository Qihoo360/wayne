package permission

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type GroupController struct {
	base.APIController
}

func (c *GroupController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Create", c.Create)
	c.Mapping("Delete", c.Delete)
}

func (c *GroupController) Prepare() {
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
// @Description get all group
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Success 200 {object} []models.Group success
// @router / [get]
func (c *GroupController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	gtype := c.Input().Get("type")
	if gtype != "" {
		param.Query["type__exact"] = gtype
	}

	total, err := models.GetTotal(new(models.Group), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	groups := []models.Group{}
	err = models.GetAll(new(models.Group), &groups, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	c.Success(param.NewPage(total, groups))
	return
}

// @Title Create
// @Description create group
// @Param	body		body 	models.Group	true		"The group content"
// @Success 200 return models.Group success
// @router / [post]
func (c *GroupController) Create() {
	var group models.Group
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &group)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("Group")
		return
	}
	_, err = models.GroupModel.AddGroup(&group)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(group)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.Group success
// @router /:id [get]
func (c *GroupController) Get() {
	id := c.GetIDFromURL()

	group, err := models.GroupModel.GetGroupById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(group)
}

// @Title Update
// @Description update the group
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.Group	true		"The body"
// @Success 200 models.Group success
// @router /:id [put]
func (c *GroupController) Update() {
	var group *models.Group
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &group)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Group")
		return
	}

	err = models.GroupModel.UpdateGroupById(group)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}

	c.Success(group)
}

// @Title Delete
// @Description delete the Group
// @Param	id		path 	int	true		"The id you want to delete"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *GroupController) Delete() {
	id := c.GetIDFromURL()

	err := models.GroupModel.DeleteGroup(int64(id))
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(nil)
}
