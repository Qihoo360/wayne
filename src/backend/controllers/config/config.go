package config

import (
	"encoding/json"

	"github.com/astaxie/beego"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type ConfigController struct {
	base.APIController
}

func (c *ConfigController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("ListSystem", c.ListSystem)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

// @Title GetConfig
// @Description get system config
// @Success 200 {object} Config success
// @router /system [get]
func (c *ConfigController) ListSystem() {
	appConfig, err := beego.AppConfig.GetSection("default")
	if err != nil {
		c.HandleError(err)
		return
	}
	c.Success(appConfig)
}

// @Title GetConfig
// @Description get system config
// @Success 200 {object} Config success
// @router / [get]
func (c *ConfigController) List() {
	param := c.BuildQueryParam()
	var configs []models.Config

	total, err := models.GetTotal(new(models.Config), param)
	if err != nil {
		logs.Error("get total count by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	err = models.GetAll(new(models.Config), &configs, param)
	if err != nil {
		logs.Error("list by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}

	c.Success(param.NewPage(total, configs))
}

// @Title Create
// @Description create Config
// @Param	body		body 	models.Config	true		"The Config content"
// @Success 200 return id success
// @Failure 403 body is empty
// @router / [post]
func (c *ConfigController) Create() {
	var config models.Config
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &config)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("Config")
	}

	id, err := models.ConfigModel.Add(&config)

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
// @Param	body		body 	models.Config	true		"The body"
// @Success 200 id success
// @Failure 403 :id is empty
// @router /:id([0-9]+) [put]
func (c *ConfigController) Update() {
	id := c.GetIDFromURL()

	var config models.Config
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &config)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Config")
	}
	config.Id = int64(id)
	err = models.ConfigModel.UpdateById(&config)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(config)
}

// @Title Get
// @Description find Object by objectid
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.Config success
// @Failure 403 :id is empty
// @router /:id([0-9]+) [get]
func (c *ConfigController) Get() {
	id := c.GetIDFromURL()

	config, err := models.ConfigModel.GetById(int64(id))
	if err != nil {
		logs.Error("get error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(config)
}

// @Title Delete
// @Description delete the app
// @Param	id		path 	int	true		"The id you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 id is empty
// @router /:id([0-9]+) [delete]
func (c *ConfigController) Delete() {
	id := c.GetIDFromURL()

	err := models.ConfigModel.DeleteById(int64(id))
	if err != nil {
		logs.Error("delete error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
