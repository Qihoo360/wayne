package configmap

import (
	"encoding/json"
	"fmt"

	"k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type ConfigMapTplController struct {
	base.APIController
}

func (c *ConfigMapTplController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *ConfigMapTplController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeConfigMap, perAction)
	}
}

// @Title GetAll
// @Description get all ConfigMapTemplate
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted"
// @Success 200 {object} []models.ConfigMapTemplate success
// @router / [get]
func (c *ConfigMapTplController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	isOnline := c.GetIsOnlineFromQuery()

	configmapId := c.Input().Get("cId")
	if configmapId != "" {
		param.Query["config_map_id"] = configmapId
	}
	var configMapTpls []models.ConfigMapTemplate
	total, err := models.ListTemplate(&configMapTpls, param, models.TableNameConfigMapTemplate, models.PublishTypeConfigMap, isOnline)
	if err != nil {
		logs.Error("list by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for index, tpl := range configMapTpls {
		configMapTpls[index].ConfigMapId = tpl.ConfigMap.Id
	}

	c.Success(param.NewPage(total, configMapTpls))
	return
}

// @Title Create
// @Description create ConfigMapTemplate
// @Param	body		body 	models.ConfigMapTemplate	true		"The ConfigMapTemplate content"
// @Success 200 return models.ConfigMapTemplate success
// @router / [post]
func (c *ConfigMapTplController) Create() {
	var configMapTpl models.ConfigMapTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &configMapTpl)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("ConfigMapTemplate")
	}
	if err = validConfigMapTemplate(configMapTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("kubeConfigMap")
	}

	configMapTpl.User = c.User.Name
	_, err = models.ConfigMapTplModel.Add(&configMapTpl)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(configMapTpl)
}

func validConfigMapTemplate(templateStr string) error {
	configMapTpl := v1.ConfigMap{}
	err := json.Unmarshal(hack.Slice(templateStr), &configMapTpl)
	if err != nil {
		return fmt.Errorf("configMapTpl template format error.%v", err.Error())
	}
	return nil
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.ConfigMapTemplate success
// @router /:id([0-9]+) [get]
func (c *ConfigMapTplController) Get() {
	id := c.GetIDFromURL()

	configMapTpl, err := models.ConfigMapTplModel.GetById(int64(id))
	if err != nil {
		logs.Error("get template error %v", err)
		c.HandleError(err)
		return
	}

	c.Success(configMapTpl)
	return
}

// @Title Update
// @Description update the ConfigMapTemplate
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.ConfigMapTemplate	true		"The body"
// @Success 200 models.ConfigMapTemplate success
// @router /:id [put]
func (c *ConfigMapTplController) Update() {
	id := c.GetIDFromURL()
	var configMapTpl models.ConfigMapTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &configMapTpl)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("ConfigMapTemplate")
		return
	}
	if err = validConfigMapTemplate(configMapTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeConfigMap")
		return
	}

	configMapTpl.Id = int64(id)
	err = models.ConfigMapTplModel.UpdateById(&configMapTpl)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(configMapTpl)
}

// @Title Delete
// @Description delete the ConfigMapTemplate
// @Param	tplId		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *ConfigMapTplController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.ConfigMapTplModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
