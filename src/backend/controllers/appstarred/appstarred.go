package appstarred

import (
	"encoding/json"

	"github.com/astaxie/beego/logs"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
)

type AppStarredController struct {
	base.APIController
}

func (c *AppStarredController) URLMapping() {
	c.Mapping("Create", c.Create)
	c.Mapping("Delete", c.Delete)
}

func (c *AppStarredController) Prepare() {
	// Check administration
	c.APIController.Prepare()
}

// @Title Create
// @Description create AppStarred
// @Param	body		body 	models.AppStarred	true		"The app content"
// @Success 200 return id success
// @Failure 403 body is empty
// @router / [post]
func (c *AppStarredController) Create() {
	var appStarred models.AppStarred
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &appStarred)
	if err != nil {
		c.AbortBadRequestFormat("AppStarred")
	}
	appStarred.User = c.User

	objectid, err := models.AppStarredModel.Add(&appStarred)

	if err != nil {
		logs.Error("create appStarred error.", err)
		c.HandleError(err)
		return
	}
	c.Success(objectid)
}

// @Title Delete by AppId
// @Description delete the AppStarred
// @Param	name		path 	string	true		"The appId you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 appId is empty
// @router /:appId [delete]
func (c *AppStarredController) Delete() {
	appId := c.GetIntParamFromURL(":appId")

	err := models.AppStarredModel.DeleteByAppId(c.User.Id, int64(appId))
	if err != nil {
		logs.Error("delete appStarred error.", err, appId)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
