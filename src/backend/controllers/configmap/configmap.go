package configmap

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type ConfigMapController struct {
	base.APIController
}

func (c *ConfigMapController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *ConfigMapController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeConfigMap, perAction)
	}
}

// @Title List/
// @Description get all id and names
// @Param	deleted		query 	bool	false		"is deleted,default false."
// @Success 200 {object} []models.ConfigMap success
// @router /names [get]
func (c *ConfigMapController) GetNames() {
	filters := make(map[string]interface{})
	deleted := c.GetDeleteFromQuery()
	filters["Deleted"] = deleted
	if c.AppId != 0 {
		filters["App__Id"] = c.AppId
	}

	configMaps, err := models.ConfigMapModel.GetNames(filters)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(configMaps)
}

// @Title GetAll
// @Description get all ConfigMap
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted, default list all"
// @Success 200 {object} []models.ConfigMap success
// @router / [get]
func (c *ConfigMapController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}
	configMap := []models.ConfigMap{}

	if c.AppId != 0 {
		param.Query["App__Id"] = c.AppId
	} else if !c.User.Admin {
		param.Query["App__AppUsers__User__Id__exact"] = c.User.Id
		perName := models.PermissionModel.MergeName(models.PermissionTypeConfigMap, models.PermissionRead)
		param.Query["App__AppUsers__Group__Permissions__Permission__Name__contains"] = perName
		param.Groupby = []string{"Id"}
	}

	total, err := models.GetTotal(new(models.ConfigMap), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.ConfigMap), &configMap, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for key, one := range configMap {
		configMap[key].AppId = one.App.Id
	}

	c.Success(param.NewPage(total, configMap))
	return
}

// @Title Create
// @Description create ConfigMap
// @Param	body		body 	models.ConfigMap	true		"The ConfigMap content"
// @Success 200 return models.ConfigMap success
// @router / [post]
func (c *ConfigMapController) Create() {
	var configmap models.ConfigMap
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &configmap)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("ConfigMap")
	}

	configmap.User = c.User.Name
	_, err = models.ConfigMapModel.Add(&configmap)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(configmap)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.ConfigMap success
// @router /:id([0-9]+) [get]
func (c *ConfigMapController) Get() {
	id := c.GetIDFromURL()

	configmap, err := models.ConfigMapModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(configmap)
	return
}

// @Title Update
// @Description update the ConfigMap
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.ConfigMap	true		"The body"
// @Success 200 models.ConfigMap success
// @router /:id [put]
func (c *ConfigMapController) Update() {
	id := c.GetIDFromURL()
	var configmap models.ConfigMap
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &configmap)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("ConfigMap")
		return
	}

	configmap.Id = int64(id)
	err = models.ConfigMapModel.UpdateById(&configmap)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(configmap)
}

// @Title UpdateOrders
// @Description batch update the Orders
// @Param	body		body 	[]models.ConfigMap	true		"The body"
// @Success 200 models.Deployment success
// @router /updateorders [put]
func (c *ConfigMapController) UpdateOrders() {
	var configMaps []*models.ConfigMap
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &configMaps)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("configMaps")
	}

	err = models.ConfigMapModel.UpdateOrders(configMaps)
	if err != nil {
		logs.Error("update orders (%v) error.%v", configMaps, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}

// @Title Delete
// @Description delete the ConfigMap
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *ConfigMapController) Delete() {
	id := c.GetIDFromURL()

	logical := c.GetLogicalFromQuery()

	err := models.ConfigMapModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
