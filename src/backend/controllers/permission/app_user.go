package permission

import (
	"encoding/json"

	"github.com/astaxie/beego/orm"
	"github.com/mitchellh/mapstructure"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/workers/webhook"
)

// 操作AppUser相关资源
type AppUserController struct {
	base.APIController
}

func (c *AppUserController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("GetPermissionByApp", c.GetPermissionByApp)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *AppUserController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeAppUser, perAction)
	}
}

// @Title List/
// @Description get all appUser
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Success 200 {object} []models.AppUser success
// @router / [get]
func (c *AppUserController) List() {
	param := c.BuildQueryParam()

	if c.AppId != 0 {
		param.Query["App__Id__exact"] = c.AppId
	}

	userId := c.Input().Get("userId")
	if userId != "" {
		param.Query["User__Id__exact"] = userId
	}
	userName := c.Input().Get("userName")
	if userName != "" {
		param.Query["User__Name__contains"] = userName
	}
	param.Groupby = []string{"App", "User"}

	total, err := models.GetTotal(new(models.AppUser), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	appUsers := []models.AppUser{}

	err = models.GetAll(new(models.AppUser), &appUsers, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	// 获取这批用户的group列表
	err = models.AppUserModel.SetGroupsName(appUsers)
	if err != nil {
		logs.Error("get appUsers group-name failed. %v", err)
		c.HandleError(err)
		return
	}
	c.Success(param.NewPage(total, appUsers))
}

// @Title Create
// @Description create app
// @Param	body		body 	models.AppUser	true		"The app content"
// @Success 200 return models.AppUser success
// @router / [post]
func (c *AppUserController) Create() {
	var appUser models.AppUser
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &appUser)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("AppUser")
		return
	}

	oneGroup := c.Input().Get("oneGroup")
	groupsFlag := true
	if oneGroup != "" {
		groupsFlag = false
	}

	// 检查该app所属的namespace，是否配置了group
	app, err := models.AppModel.GetById(appUser.App.Id)
	if err != nil {
		logs.Error("get app error.%v", err.Error())
		c.HandleError(err)
		return
	}
	_, err = models.NamespaceUserModel.GetByNamespaceIdAndUserId(app.Namespace.Id, appUser.User.Id)
	if err == orm.ErrNoRows {
		c.AbortForbidden("User not in namespace.")
	} else if err != nil {
		logs.Error("check namespace-user error.%v", err.Error())
		c.HandleError(err)
		return
	}

	_, err = models.AppUserModel.Add(&appUser, groupsFlag)
	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}

	webhook.PublishEventMember(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.AddMember, *appUser.User)
	c.Success(appUser)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.AppUser success
// @router /:id [get]
func (c *AppUserController) Get() {
	id := c.GetIDFromURL()

	oneGroup := c.Input().Get("oneGroup")
	groupsFlag := true
	if oneGroup != "" {
		groupsFlag = false
	}
	ns, err := models.AppUserModel.GetById(int64(id), groupsFlag)
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(ns)
	return
}

// @Title GetPerApp
// @Description get PerApp by appId
// @Param	id		path 	int	true		"the app id"
// @Success 200 {object} models.TypeApp success
// @router /permissions/:id [get]
func (c *AppUserController) GetPermissionByApp() {
	id := c.GetIDFromURL()

	appPers, err := models.AppUserModel.GetAllPermission(int64(id), c.User.Id)
	if err != nil {
		logs.Error("get permission by app id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	app, err := models.AppModel.GetById(int64(id))
	if err != nil {
		logs.Error("get app by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	nsPers, err := models.NamespaceUserModel.GetAllPermission(app.Namespace.Id, c.User.Id)
	if err != nil {
		logs.Error("get permission by namespace id (%d) error.%v", app.Namespace.Id, err)
		c.HandleError(err)
		return
	}

	var ret models.TypePermission
	mapPer := make(map[string]map[string]bool)
	for _, permission := range appPers {
		paction, ptype, err := models.PermissionModel.SplitName(permission.Name)
		if err != nil {
			logs.Error("app permission split error %v", err)
			c.HandleError(err)
			return
		}
		_, ok := mapPer[ptype]
		if ok != true {
			mapPer[ptype] = make(map[string]bool)
		}
		mapPer[ptype][paction] = true
	}

	for _, permission := range nsPers {
		paction, ptype, err := models.PermissionModel.SplitName(permission.Name)
		if err != nil {
			logs.Error("namespace permission split error %v", err)
			c.HandleError(err)
			return
		}
		_, ok := mapPer[ptype]
		if ok != true {
			mapPer[ptype] = make(map[string]bool)
		}
		mapPer[ptype][paction] = true
	}

	if err = mapstructure.Decode(mapPer, &ret); err != nil {
		logs.Error("permission mapstructure decode error %v", err)
		c.HandleError(err)
		return
	}

	c.Success(ret)
	return
}

// @Title Update
// @Description update the AppUser
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.AppUser	true		"The body"
// @Success 200 models.Namespace success
// @router /:id [put]
func (c *AppUserController) Update() {
	id := c.GetIDFromURL()
	oneGroup := c.Input().Get("oneGroup")
	groupsFlag := true
	if oneGroup != "" {
		groupsFlag = false
	}
	var appUser models.AppUser
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &appUser)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("AppUser")
		return
	}

	appUser.Id = int64(id)
	err = models.AppUserModel.UpdateById(&appUser, groupsFlag)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	webhook.PublishEventMember(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.UpdateMember, *appUser.User)
	c.Success(appUser)
}

// @Title Delete
// @Description delete the AppUser
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *AppUserController) Delete() {
	id := c.GetIDFromURL()
	oneGroup := c.Input().Get("oneGroup")
	groupsFlag := true
	if oneGroup != "" {
		groupsFlag = false
	}

	appUser, err := models.AppUserModel.GetById(int64(id), groupsFlag)
	if err != nil {
		logs.Error("get by %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	err = models.AppUserModel.DeleteById(int64(id), groupsFlag)
	if err != nil {
		logs.Error("delete by %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	webhook.PublishEventMember(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.DeleteMember, *appUser.User)
	c.Success(nil)
}
