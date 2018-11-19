package statefulset

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type StatefulsetController struct {
	base.APIController
}

func (c *StatefulsetController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *StatefulsetController) Prepare() {
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

// @Title List/
// @Description get all id and names
// @Param	appId		query 	int	false		"the app id"
// @Param	deleted		query 	bool	false		"is deleted,default false."
// @Success 200 {object} []models.Statefulset success
// @router /names [get]
func (c *StatefulsetController) GetNames() {
	filters := make(map[string]interface{})
	deleted := c.GetDeleteFromQuery()
	filters["Deleted"] = deleted
	if c.AppId != 0 {
		filters["App__Id"] = c.AppId
	}

	statefulsets, err := models.StatefulsetModel.GetNames(filters)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(statefulsets)
}

// @Title GetAll
// @Description get all Statefulset
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	appId		query 	int	false		"the app id"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted, default list all"
// @Success 200 {object} []models.Statefulset success
// @router / [get]
func (c *StatefulsetController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	var statefulsets []models.Statefulset
	if c.AppId != 0 {
		param.Query["App__Id"] = c.AppId
	}

	total, err := models.GetTotal(new(models.Statefulset), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.Statefulset), &statefulsets, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for key, one := range statefulsets {
		statefulsets[key].AppId = one.App.Id
	}

	c.Success(param.NewPage(total, statefulsets))
	return
}

// @Title Create
// @Description create Statefulset
// @Param	body		body 	models.Statefulset	true		"The Statefulset content"
// @Success 200 return models.Statefulset success
// @router / [post]
func (c *StatefulsetController) Create() {
	var statefulset models.Statefulset
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &statefulset)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("Statefulset")
	}

	statefulset.User = c.User.Name
	_, err = models.StatefulsetModel.Add(&statefulset)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(statefulset)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.Statefulset success
// @router /:id([0-9]+) [get]
func (c *StatefulsetController) Get() {
	id := c.GetIDFromURL()

	statefulset, err := models.StatefulsetModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(statefulset)
}

// @Title Update
// @Description update the Statefulset
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.Statefulset	true		"The body"
// @Success 200 models.Statefulset success
// @router /:id([0-9]+) [put]
func (c *StatefulsetController) Update() {
	id := c.GetIDFromURL()

	var statefulset models.Statefulset
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &statefulset)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Statefulset")
	}

	statefulset.Id = int64(id)
	err = models.StatefulsetModel.UpdateById(&statefulset)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(statefulset)
}

// @Title UpdateOrders
// @Description batch update the Orders
// @Param	body		body 	[]models.Statefulset	true		"The body"
// @Success 200 models.Deployment success
// @router /updateorders [put]
func (c *StatefulsetController) UpdateOrders() {
	var statefulsets []*models.Statefulset
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &statefulsets)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Statefulsets")
	}

	err = models.StatefulsetModel.UpdateOrders(statefulsets)
	if err != nil {
		logs.Error("update orders (%v) error.%v", statefulsets, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}

// @Title Delete
// @Description delete the Statefulset
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id([0-9]+) [delete]
func (c *StatefulsetController) Delete() {
	id := c.GetIDFromURL()

	logical := c.GetLogicalFromQuery()

	err := models.StatefulsetModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
