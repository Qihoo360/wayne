package customlink

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type LinkTypeController struct {
	base.APIController
}

func (c *LinkTypeController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *LinkTypeController) Prepare() {
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
	if perAction != "" && !c.User.Admin {
		c.AbortForbidden("operation need admin permission.")
	}
}

// @Title GetLinkType
// @Description get outer custom link type
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	deleted		query 	bool	false		"is deleted"
// @Success 200 {object} LinkType success
// @router / [get]
func (c *LinkTypeController) List() {
	param := c.BuildQueryParam()
	var linkTypes []models.LinkType

	total, err := models.GetTotal(new(models.LinkType), param)
	if err != nil {
		logs.Error("get total count by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	err = models.GetAll(new(models.LinkType), &linkTypes, param)
	if err != nil {
		logs.Error("list by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}

	c.Success(param.NewPage(total, linkTypes))
}

// @Title Create
// @Description create LinkType
// @Param	body		body 	models.LinkType	true		"The LinkType content"
// @Success 200 return id success
// @Failure 403 body is empty
// @router / [post]
func (c *LinkTypeController) Create() {
	var linkType models.LinkType
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &linkType)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("linkType")
	}

	id, err := models.LinkTypeModel.Add(&linkType)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(id)
}

// @Title Update
// @Description update the object
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.LinkType	true		"The body"
// @Success 200 id success
// @Failure 403 :id is empty
// @router /:id([0-9]+) [put]
func (c *LinkTypeController) Update() {
	id := c.GetIDFromURL()

	var linkType models.LinkType
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &linkType)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("linkType")
	}
	linkType.Id = int64(id)
	err = models.LinkTypeModel.UpdateById(&linkType)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(linkType)
}

// @Title Get
// @Description find Object by objectid
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.LinkType success
// @Failure 403 :id is empty
// @router /:id([0-9]+) [get]
func (c *LinkTypeController) Get() {
	id := c.GetIDFromURL()

	linkType, err := models.LinkTypeModel.GetById(int64(id))
	if err != nil {
		logs.Error("get error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(linkType)
}

// @Title Delete
// @Description delete the linkType
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *LinkTypeController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.LinkTypeModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
