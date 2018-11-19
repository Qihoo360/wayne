package permission

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type UserController struct {
	base.APIController
}

func (c *UserController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("ResetPassword", c.ResetPassword)
	c.Mapping("UpdateAdmin", c.UpdateAdmin)
	c.Mapping("Create", c.Create)
	c.Mapping("Delete", c.Delete)
	c.Mapping("UserStatistics", c.UserStatistics)
}

func (c *UserController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	// Check permission
	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Create":
		perAction = models.PermissionCreate
	case "Update":
		perAction = models.PermissionUpdate
	case "Delete":
		perAction = models.PermissionDelete
	case "ResetPassword":
		perAction = models.PermissionUpdate
	case "UpdateAdmin":
		perAction = models.PermissionUpdate
	}
	if perAction != "" && !c.User.Admin {
		c.AbortForbidden("operation need admin permission.")
	}
}

// @Title user statistics
// @Description user count statistics
// @Success 200 {object} models.AppCount success
// @router /statistics [get]
func (c *UserController) UserStatistics() {
	param := c.BuildQueryParam()

	total, err := models.GetTotal(new(models.User), param)
	if err != nil {
		logs.Error("get user total count error. %v", err)
		c.HandleError(err)
		return
	}
	c.Success(models.UserStatistics{Total: total})
}

// @Title GetAll
// @Description get all user
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Success 200 {object} []models.User success
// @router / [get]
func (c *UserController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}
	total, err := models.GetTotal(new(models.User), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	users := []models.User{}
	err = models.GetAll(new(models.User), &users, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	c.Success(param.NewPage(total, users))
}

// @Title GetNames/
// @Description get all id and names
// @Success 200 {object} []models.User success
// @router /names [get]
func (c *UserController) GetNames() {
	users, err := models.UserModel.GetNames()
	if err != nil {
		logs.Error("get names error. %v", err)
		c.HandleError(err)
		return
	}

	c.Success(users)
}

// @Title Create
// @Description create user
// @Param	body		body 	models.User	true		"The user content"
// @Success 200 return models.User success
// @router / [post]
func (c *UserController) Create() {
	var user models.User
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &user)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("User")
		return
	}
	_, err = models.UserModel.AddUser(&user)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(user)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.User success
// @router /:id [get]
func (c *UserController) Get() {
	id := c.GetIDFromURL()

	user, err := models.UserModel.GetUserById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(user)
}

// @Title Update
// @Description update the user admin
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	Object	true		"The body"
// @Success 200 models.User success
// @router /:id/resetpassword [put]
func (c *UserController) ResetPassword() {
	var user *struct {
		Id       int64  `json:"id"`
		Password string `json:"password"`
	}
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &user)
	if err != nil {
		logs.Error("user param error. %v", err)
		c.HandleError(err)
		return
	}

	err = models.UserModel.ResetUserPassword(user.Id, user.Password)
	if err != nil {
		logs.Error("update password error.%v", err)
		c.HandleError(err)
		return
	}

	c.Success(user)
}

// @Title Update
// @Description update the user admin
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.User	true		"The body"
// @Success 200 models.User success
// @router /:id/admin [put]
func (c *UserController) UpdateAdmin() {
	var user *models.User
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &user)
	if err != nil {
		logs.Error("user param error. %v", err)
		c.AbortBadRequestFormat("User")
		return
	}

	err = models.UserModel.UpdateUserAdmin(user)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}

	c.Success(user)
}

// @Title Update
// @Description update the user
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.User	true		"The body"
// @Success 200 models.User success
// @router /:id [put]
func (c *UserController) Update() {
	var user *models.User
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &user)
	if err != nil {
		logs.Error("id param error. %v", err)
		c.AbortBadRequestFormat("User")
		return
	}

	err = models.UserModel.UpdateUserById(user)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}

	c.Success(user)
}

// @Title Delete
// @Description delete the User
// @Param	id		path 	int	true		"The id you want to delete"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *UserController) Delete() {
	id := c.GetIDFromURL()

	err := models.UserModel.DeleteUser(int64(id))
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
