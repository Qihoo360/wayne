package config

import (
	"net/http"
	"strconv"

	"github.com/astaxie/beego"

	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type BaseConfigController struct {
	beego.Controller
}

func (c *BaseConfigController) URLMapping() {
	c.Mapping("ListBase", c.ListBase)
}

// @Title GetConfig
// @Description get base config
// @Success 200 {object} Config success
// @router / [get]
func (c *BaseConfigController) ListBase() {
	configMap := make(map[string]interface{})
	configMap["appUrl"] = beego.AppConfig.String("AppUrl")
	configMap["betaUrl"] = beego.AppConfig.String("BetaUrl")
	configMap["enableDBLogin"] = beego.AppConfig.DefaultBool("EnableDBLogin", false)
	configMap["appLabelKey"] = util.AppLabelKey
	configMap["namespaceLabelKey"] = util.NamespaceLabelKey
	configMap["enableRobin"] = beego.AppConfig.DefaultBool("EnableRobin", false)
	configMap["ldapLogin"] = parseAuthEnabled("auth.ldap")
	configMap["oauth2Login"] = parseAuthEnabled("auth.oauth2")
	configMap["enableApiKeys"] = beego.AppConfig.DefaultBool("EnableApiKeys", false)

	var configs []models.Config
	err := models.GetAll(new(models.Config), &configs, &common.QueryParam{
		PageSize: 1000,
		PageNo:   1,
	})
	if err != nil {
		logs.Error("list configs error. %v", err)
		c.Ctx.Output.SetStatus(http.StatusInternalServerError)
		return
	}

	for _, conf := range configs {
		configMap[string(conf.Name)] = conf.Value
	}
	c.Ctx.Output.SetStatus(http.StatusOK)
	c.Data["json"] = base.Result{Data: configMap}
	c.ServeJSON()
}

func parseAuthEnabled(name string) bool {
	enabled := false
	enabledSection, err := beego.AppConfig.GetSection(name)
	if err == nil {
		enabledBool, err := strconv.ParseBool(enabledSection["enabled"])
		if err == nil {
			enabled = enabledBool
		}
	}
	return enabled
}
