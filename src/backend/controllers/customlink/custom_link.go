package customlink

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type CustomLinkController struct {
	base.APIController
}

func (c *CustomLinkController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
	c.Mapping("UpdateStatus", c.ChangeStatus)
}

func (c *CustomLinkController) Prepare() {
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

// @Title GetCustomLink
// @Description get outer custom link type
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	deleted		query 	bool	false		"is deleted"
// @Success 200 {object} CustomLink success
// @router / [get]
func (c *CustomLinkController) List() {
	param := c.BuildQueryParam()
	var customLinks []models.CustomLink

	total, err := models.GetTotal(new(models.CustomLink), param)
	if err != nil {
		logs.Error("get total count by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	err = models.GetAll(new(models.CustomLink), &customLinks, param)
	if err != nil {
		logs.Error("list by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	var linkTypes []*models.LinkType
	deleted := false
	linkTypes, err = models.LinkTypeModel.GetAll(deleted)
	if err != nil {
		logs.Error("link types get failed")
		c.HandleError(err)
		return
	}
	nameMap := make(map[string]string)
	for _, link := range linkTypes {
		nameMap[link.TypeName] = link.Displayname
	}

	for i, ck := range customLinks {
		customLinks[i].Displayname = nameMap[ck.LinkType]
	}

	c.Success(param.NewPage(total, customLinks))
}

// @Title Create
// @Description create CustomLink
// @Param	body		body 	models.CustomLink	true		"The CustomLink content"
// @Success 200 return id success
// @Failure 403 body is empty
// @router / [post]
func (c *CustomLinkController) Create() {
	var customLink models.CustomLink
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &customLink)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("customLink")
	}

	id, err := models.CustomLinkModel.Add(&customLink)

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
// @Param	body		body 	models.CustomLink	true		"The body"
// @Success 200 id success
// @Failure 403 :id is empty
// @router /:id([0-9]+) [put]
func (c *CustomLinkController) Update() {
	id := c.GetIDFromURL()

	var customLink models.CustomLink
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &customLink)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("customLink")
	}
	customLink.Id = int64(id)
	err = models.CustomLinkModel.UpdateById(&customLink)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(customLink)
}

// @Title Get
// @Description find Object by objectid
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.CustomLink success
// @Failure 403 :id is empty
// @router /:id([0-9]+) [get]
func (c *CustomLinkController) Get() {
	id := c.GetIDFromURL()

	customLink, err := models.CustomLinkModel.GetById(int64(id))
	if err != nil {
		logs.Error("get error.%v", err)
		c.HandleError(err)
		return
	}
	linktype, err := models.LinkTypeModel.GetByType(customLink.LinkType)
	if err != nil {
		logs.Error("get link type error.%v", err)
		c.HandleError(err)
		return
	}
	customLink.Displayname = linktype.Displayname
	c.Success(customLink)
}

// @Title Delete
// @Description delete the customLink
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *CustomLinkController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.CustomLinkModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}

// @Title ChangeStatus
// @Description change the customLink status
// @Param	id		path 	int	true		"The id you want to change status"
// @Success 200 {string} update success!
// @router /:id/status [put]
func (c *CustomLinkController) ChangeStatus() {
	id := c.GetIDFromURL()

	err := models.CustomLinkModel.ChangeStatusById(int64(id))
	if err != nil {
		logs.Error("change status %d failed.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
