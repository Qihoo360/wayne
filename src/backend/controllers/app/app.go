package app

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

// 操作App相关资源
type AppController struct {
	base.APIController
}

func (c *AppController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
	c.Mapping("AppStatistics", c.AppStatistics)
}

func (c *AppController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeApp, perAction)
	}
}

// @Title app statistics
// @Description app count statistics
// @Success 200 {object} models.AppCount success
func (c *AppController) AppStatistics() {
	param := c.BuildQueryParam()
	total, err := models.GetTotal(new(models.App), param)
	if err != nil {
		logs.Error("get app total count error. %v", err)
		c.HandleError(err)
		return
	}
	details, err := models.AppModel.GetAppCountGroupByNamespace()
	if err != nil {
		logs.Error("get app total detail error. %v", err)
		c.HandleError(err)
		return
	}

	c.Success(models.AppStatistics{Total: total, Details: details})
}

// @Title List/
// @Description get all id and names
// @Param	deleted		query 	bool	false		"is deleted,default false."
// @Success 200 {object} []models.App success
// @router /names [get]
func (c *AppController) GetNames() {
	deleted := c.GetDeleteFromQuery()

	apps, err := models.AppModel.GetNames(deleted)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(apps)
}

// @Title List/
// @Description get all app
// @Param	starred		query 	bool	false		"is starred app.default not star"
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	false		"name filter"
// @Param	namespaceId		query 	int	false		"namespace id"
// @Param	deleted		query 	bool	false		"is deleted, default list all."
// @Success 200 {object} []models.App success
// @router / [get]
func (c *AppController) List() {
	param := c.BuildQueryParam()
	if c.NamespaceId != 0 {
		param.Query["namespace_id"] = c.NamespaceId
	}

	starred := c.GetBoolParamFromQueryWithDefault("starred", false)

	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	total, err := models.AppModel.Count(param, starred, c.User.Id)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	apps, err := models.AppModel.List(param, starred, c.User.Id)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	c.Success(param.NewPage(total, apps))
	return
}

// @Title Create
// @Description create app
// @Param	body		body 	models.App	true		"The app content"
// @Success 200 return models.App success
// @router / [post]
func (c *AppController) Create() {
	var app models.App
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &app)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("App")
		return
	}

	app.User = c.User.Name
	_, err = models.AppModel.Add(&app)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(app)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.App success
// @router /:id([0-9]+) [get]
func (c *AppController) Get() {
	id := c.GetIDFromURL()

	app, err := models.AppModel.GetById(int64(id))
	if err != nil {
		logs.Error("get app by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(app)
	return
}

// @Title Update
// @Description update the App
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.App	true		"The body"
// @Success 200 models.Namespace success
// @router /:id [put]
func (c *AppController) Update() {
	id := c.GetIDFromURL()
	var app models.App
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &app)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("App")
	}

	app.Id = int64(id)
	err = models.AppModel.UpdateById(&app)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(app)
}

// @Title Delete
// @Description delete the App
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *AppController) Delete() {
	id := c.GetIDFromURL()

	logical := c.GetLogicalFromQuery()

	err := models.AppModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
