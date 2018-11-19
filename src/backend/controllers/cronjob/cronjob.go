package cronjob

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type CronjobController struct {
	base.APIController
}

func (c *CronjobController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *CronjobController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeCronjob, perAction)
	}
}

// @Title List/
// @Description get all id and names
// @Param	deleted		query 	bool	false		"is deleted,default false."
// @Success 200 {object} []models.Cronjob success
// @router /names [get]
func (c *CronjobController) GetNames() {
	filters := make(map[string]interface{})
	deleted := c.GetDeleteFromQuery()
	filters["Deleted"] = deleted
	if c.AppId != 0 {
		filters["App__Id"] = c.AppId
	}

	cronjobs, err := models.CronjobModel.GetNames(filters)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(cronjobs)
}

// @Title GetAll
// @Description get all Cronjob
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted, default list all"
// @Success 200 {object} []models.Cronjob success
// @router / [get]
func (c *CronjobController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}
	cronjob := []models.Cronjob{}

	if c.AppId != 0 {
		param.Query["App__Id"] = c.AppId
	} else if !c.User.Admin {
		param.Query["App__AppUsers__User__Id__exact"] = c.User.Id
		perName := models.PermissionModel.MergeName(models.PermissionTypeCronjob, models.PermissionRead)
		param.Query["App__AppUsers__Group__Permissions__Permission__Name__contains"] = perName
		param.Groupby = []string{"Id"}
	}

	total, err := models.GetTotal(new(models.Cronjob), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.Cronjob), &cronjob, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for key, one := range cronjob {
		cronjob[key].AppId = one.App.Id
	}

	c.Success(param.NewPage(total, cronjob))
	return
}

// @Title Create
// @Description create Cronjob
// @Param	body		body 	models.Cronjob	true		"The Cronjob content"
// @Success 200 return models.Cronjob success
// @router / [post]
func (c *CronjobController) Create() {
	var cronjob models.Cronjob
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &cronjob)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("Cronjob")
		return
	}

	cronjob.User = c.User.Name
	_, err = models.CronjobModel.Add(&cronjob)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(cronjob)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.Cronjob success
// @router /:id([0-9]+) [get]
func (c *CronjobController) Get() {
	id := c.GetIDFromURL()

	cronjob, err := models.CronjobModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(cronjob)
	return
}

// @Title Update
// @Description update the Cronjob
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.Cronjob	true		"The body"
// @Success 200 models.Cronjob success
// @router /:id [put]
func (c *CronjobController) Update() {
	id := c.GetIDFromURL()
	var cronjob models.Cronjob
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &cronjob)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Cronjob")
	}

	cronjob.Id = int64(id)
	err = models.CronjobModel.UpdateById(&cronjob)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(cronjob)
}

// @Title UpdateOrders
// @Description batch update the Orders
// @Param	body		body 	[]models.Cronjob	true		"The body"
// @Success 200 models.Deployment success
// @router /updateorders [put]
func (c *CronjobController) UpdateOrders() {
	var cronjobs []*models.Cronjob
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &cronjobs)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("cronjobs")
	}

	err = models.CronjobModel.UpdateOrders(cronjobs)
	if err != nil {
		logs.Error("update orders (%v) error.%v", cronjobs, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}

// @Title Delete
// @Description delete the Cronjob
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *CronjobController) Delete() {
	id := c.GetIDFromURL()

	logical := c.GetLogicalFromQuery()

	err := models.CronjobModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
