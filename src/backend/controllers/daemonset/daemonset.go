package daemonset

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type DaemonSetController struct {
	base.APIController
}

func (c *DaemonSetController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *DaemonSetController) Prepare() {
	// Check administration
	c.APIController.Prepare()
	// Check permission
	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Get", "List", "GetNames":
		perAction = models.PermissionRead
	case "Create":
		perAction = models.PermissionCreate
	case "Update":
		perAction = models.PermissionUpdate
	case "Delete":
		perAction = models.PermissionDelete
	}
	if perAction != "" {
		c.CheckPermission(models.PermissionTypeDaemonSet, perAction)
	}
}

// @Title List/
// @Description get all id and names
// @Param	appId		query 	int	false		"the app id"
// @Param	deleted		query 	bool	false		"is deleted,default false."
// @Success 200 {object} []models.DaemonSet success
// @router /names [get]
func (c *DaemonSetController) GetNames() {
	filters := make(map[string]interface{})
	deleted := c.GetDeleteFromQuery()
	filters["Deleted"] = deleted
	if c.AppId != 0 {
		filters["App__Id"] = c.AppId
	}

	daemonSets, err := models.DaemonSetModel.GetNames(filters)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(daemonSets)
}

// @Title GetAll
// @Description get all DaemonSet
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	appId		query 	int	false		"the app id"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted, default list all"
// @Success 200 {object} []models.DaemonSet success
// @router / [get]
func (c *DaemonSetController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	var daemonSets []models.DaemonSet
	if c.AppId != 0 {
		param.Query["App__Id"] = c.AppId
	}

	total, err := models.GetTotal(new(models.DaemonSet), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.DaemonSet), &daemonSets, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for key, one := range daemonSets {
		daemonSets[key].AppId = one.App.Id
	}

	c.Success(param.NewPage(total, daemonSets))
	return
}

// @Title Create
// @Description create DaemonSet
// @Param	body		body 	models.DaemonSet	true		"The DaemonSet content"
// @Success 200 return models.DaemonSet success
// @router / [post]
func (c *DaemonSetController) Create() {
	var daemonSet models.DaemonSet
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &daemonSet)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("DaemonSet")
	}

	daemonSet.User = c.User.Name
	_, err = models.DaemonSetModel.Add(&daemonSet)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(daemonSet)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.DaemonSet success
// @router /:id([0-9]+) [get]
func (c *DaemonSetController) Get() {
	id := c.GetIDFromURL()

	daemonSet, err := models.DaemonSetModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(daemonSet)
	return
}

// @Title Update
// @Description update the DaemonSet
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.DaemonSet	true		"The body"
// @Success 200 models.DaemonSet success
// @router /:id([0-9]+) [put]
func (c *DaemonSetController) Update() {
	id := c.GetIDFromURL()

	var daemonSet models.DaemonSet
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &daemonSet)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("DaemonSet")
	}

	daemonSet.Id = int64(id)
	err = models.DaemonSetModel.UpdateById(&daemonSet)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(daemonSet)
}

// @Title UpdateOrders
// @Description batch update the Orders
// @Param	body		body 	[]models.DaemonSet	true		"The body"
// @Success 200 models.Deployment success
// @router /updateorders [put]
func (c *DaemonSetController) UpdateOrders() {
	var daemonSets []*models.DaemonSet
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &daemonSets)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("DaemonSets")
	}

	err = models.DaemonSetModel.UpdateOrders(daemonSets)
	if err != nil {
		logs.Error("update orders (%v) error.%v", daemonSets, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}

// @Title Delete
// @Description delete the DaemonSet
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id([0-9]+) [delete]
func (c *DaemonSetController) Delete() {
	id := c.GetIDFromURL()

	logical := c.GetLogicalFromQuery()

	err := models.DaemonSetModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
