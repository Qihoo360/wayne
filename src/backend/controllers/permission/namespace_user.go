package permission

import (
	"encoding/json"

	"github.com/mitchellh/mapstructure"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/workers/webhook"
)

// 操作NamespaceUser相关资源
type NamespaceUserController struct {
	base.APIController
}

func (c *NamespaceUserController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("GetPermissionByNS", c.GetPermissionByNS)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *NamespaceUserController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeNamespaceUser, perAction)
	}
}

// @Title List/
// @Description get all namespaceUser
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Success 200 {object} []models.NamespaceUser success
// @router / [get]
func (c *NamespaceUserController) List() {
	param := c.BuildQueryParam()

	if c.NamespaceId != 0 {
		param.Query["Namespace__Id__exact"] = c.NamespaceId
	}

	userId := c.Input().Get("userId")
	if userId != "" {
		param.Query["User__Id__exact"] = userId
	}
	userName := c.Input().Get("userName")
	if userName != "" {
		param.Query["User__Name__contains"] = userName
	}
	param.Groupby = []string{"Namespace", "User"}

	total, err := models.GetTotal(new(models.NamespaceUser), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	namespaceUsers := []models.NamespaceUser{}

	err = models.GetAll(new(models.NamespaceUser), &namespaceUsers, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	// 获取这批用户的group列表
	err = models.NamespaceUserModel.SetGroupsName(namespaceUsers)
	if err != nil {
		logs.Error("get namespaceUsers group-name failed. %v", err)
		c.HandleError(err)
		return
	}
	c.Success(param.NewPage(total, namespaceUsers))
}

// @Title Create
// @Description create namespaceUser
// @Param	body		body 	models.NamespaceUser	true		"The namespaceUser content"
// @Success 200 return models.NamespaceUser success
// @router / [post]
func (c *NamespaceUserController) Create() {
	var namespaceUser models.NamespaceUser
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &namespaceUser)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("NamespaceUser")
	}

	oneGroup := c.Input().Get("oneGroup")
	groupsFlag := true
	if oneGroup != "" {
		groupsFlag = false
	}

	_, err = models.NamespaceUserModel.Add(&namespaceUser, groupsFlag)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	webhook.PublishEventMember(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.AddMember, *namespaceUser.User)
	c.Success(namespaceUser)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.NamespaceUser success
// @router /:id [get]
func (c *NamespaceUserController) Get() {
	id := c.GetIDFromURL()

	oneGroups := c.Input().Get("oneGroup")
	groupsFlag := true
	if oneGroups != "" {
		groupsFlag = false
	}

	ns, err := models.NamespaceUserModel.GetById(int64(id), groupsFlag)
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(ns)
}

// @Title Update
// @Description update the NamespaceUser
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.NamespaceUser	true		"The body"
// @Success 200 models.Namespace success
// @router /:id [put]
func (c *NamespaceUserController) Update() {
	id := c.GetIDFromURL()
	var namespaceUser models.NamespaceUser
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &namespaceUser)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("NamespaceUser")
		return
	}
	namespaceUser.Id = int64(id)

	oneGroup := c.Input().Get("oneGroup")
	groupsFlag := true
	if oneGroup != "" {
		groupsFlag = false
	}
	err = models.NamespaceUserModel.UpdateById(&namespaceUser, groupsFlag)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	webhook.PublishEventMember(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.UpdateMember, *namespaceUser.User)
	c.Success(namespaceUser)
}

// @Title Delete
// @Description delete the NamespaceUser
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *NamespaceUserController) Delete() {
	id := c.GetIDFromURL()

	oneGroup := c.Input().Get("oneGroup")
	groupsFlag := true
	if oneGroup != "" {
		groupsFlag = false
	}
	namespaceUser, err := models.NamespaceUserModel.GetById(int64(id), groupsFlag)
	if err != nil {
		logs.Error("get by %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	err = models.NamespaceUserModel.DeleteById(int64(id), groupsFlag)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	webhook.PublishEventMember(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.DeleteMember, *namespaceUser.User)
	c.Success(nil)
}

// @Title GetPerNS
// @Description get PerNS by nsId
// @Param	id		path 	int	true		"the ns id"
// @Success 200 {object} models.TypeApp success
// @router /permissions/:id [get]
func (c *NamespaceUserController) GetPermissionByNS() {
	id := c.GetIDFromURL()

	nsPers, err := models.NamespaceUserModel.GetAllPermission(int64(id), c.User.Id)
	if err != nil {
		logs.Error("get permission by namespace id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	var ret models.TypePermission
	mapPer := make(map[string]map[string]bool)
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
}
