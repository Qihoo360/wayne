package webhook

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/hookevent"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type WebHookController struct {
	base.APIController
}

func (c *WebHookController) URLMapping() {
	c.Mapping("GetHookEvents", c.GetHookEvents)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *WebHookController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeWebHook, perAction)
	}
}

// @Title Events
// @Description 获取所有关联事件对象
// @router /events [get]
func (c *WebHookController) GetHookEvents() {
	var events []*hookevent.HookEvent
	for _, event := range hookevent.AllHookEvents {
		events = append(events, event)
	}
	c.Success(events)
}

// @Title List
// @Description 获取Webhook列表
// @Param	pageNo		query 	int	false 		"the page current no"
// @Param	pageSize	query 	int	false 		"the page size"
// @Success 200 {object} []models.WebHook success
// @router / [get]
func (c *WebHookController) List() {
	param := c.BuildQueryParam()
	if c.AppId != 0 {
		param.Query["Scope"] = models.WebHookScopeApp
		param.Query["ObjectId"] = c.AppId
	} else {
		param.Query["Scope"] = models.WebHookScopeNamespace
		param.Query["ObjectId"] = c.NamespaceId
	}

	var webHook []models.WebHook
	err := models.GetAll(new(models.WebHook), &webHook, param)
	if err != nil {
		logs.Error(err)
		c.HandleError(err)
		return
	}
	c.Success(param.NewPage(int64(len(webHook)), webHook))
}

// @Title Create
// @Description create WebHook
// @Param	body		body 	models.WebHook	true		"The WebHook content"
// @Success 200 return models.WebHook success
// @router / [post]
func (c *WebHookController) Create() {
	var webhook models.WebHook
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &webhook)
	if err != nil {
		c.AbortBadRequestFormat("WebHook")
	}
	webhook.User = c.User.Name
	_, err = models.WebHookModel.Add(&webhook)

	if err != nil {
		logs.Error(err)
		c.HandleError(err)
		return
	}
	c.Success(webhook)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.WebHook success
// @router /:id([0-9]+) [get]
func (c *WebHookController) Get() {
	id := c.GetIDFromURL()

	webhook, err := models.WebHookModel.GetById(id)
	if err != nil {
		logs.Error(err)
		c.HandleError(err)
		return
	}

	c.Success(webhook)
}

// @Title Update
// @Description update the WebHook
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.WebHook	true		"The body"
// @Success 200 models.WebHook success
// @router /:id [put]
func (c *WebHookController) Update() {
	id := c.GetIDFromURL()
	var webhook models.WebHook
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &webhook)
	if err != nil {
		c.AbortBadRequestFormat("WebHook")
	}

	webhook.Id = int64(id)
	err = models.WebHookModel.UpdateById(&webhook)
	if err != nil {
		logs.Error(err)
		c.HandleError(err)
		return
	}
	c.Success(webhook)
}

// @Title Delete
// @Description delete the WebHook
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *WebHookController) Delete() {
	id := c.GetIDFromURL()

	err := models.WebHookModel.DeleteById(int64(id))
	if err != nil {
		logs.Error(err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
