package secret

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type SecretController struct {
	base.APIController
}

func (c *SecretController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *SecretController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeSecret, perAction)
	}
}

// @Title List/
// @Description get all id and names
// @Param	deleted		query 	bool	false		"is deleted,default false."
// @Success 200 {object} []models.Secret success
// @router /names [get]
func (c *SecretController) GetNames() {
	filters := make(map[string]interface{})
	deleted := c.GetDeleteFromQuery()
	filters["Deleted"] = deleted
	if c.AppId != 0 {
		filters["App__Id"] = c.AppId
	}

	secret, err := models.SecretModel.GetNames(filters)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(secret)
}

// @Title GetAll
// @Description get all Secret
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted, default list all"
// @Success 200 {object} []models.Secret success
// @router / [get]
func (c *SecretController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}
	secret := []models.Secret{}

	if c.AppId != 0 {
		param.Query["App__Id"] = c.AppId
	} else if !c.User.Admin {
		param.Query["App__AppUsers__User__Id__exact"] = c.User.Id
		perName := models.PermissionModel.MergeName(models.PermissionTypeSecret, models.PermissionRead)
		param.Query["App__AppUsers__Group__Permissions__Permission__Name__contains"] = perName
		param.Groupby = []string{"Id"}
	}

	total, err := models.GetTotal(new(models.Secret), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.Secret), &secret, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for key, one := range secret {
		secret[key].AppId = one.App.Id
	}

	c.Success(param.NewPage(total, secret))
	return
}

// @Title Create
// @Description create Secret
// @Param	body		body 	models.Secret	true		"The Secret content"
// @Success 200 return models.Secret success
// @router / [post]
func (c *SecretController) Create() {
	var secret models.Secret
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &secret)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("Secret")
	}

	secret.User = c.User.Name
	_, err = models.SecretModel.Add(&secret)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(secret)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.Secret success
// @router /:id([0-9]+) [get]
func (c *SecretController) Get() {
	id := c.GetIDFromURL()

	secret, err := models.SecretModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(secret)
}

// @Title Update
// @Description update the Secret
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.Secret	true		"The body"
// @Success 200 models.Secret success
// @router /:id [put]
func (c *SecretController) Update() {
	id := c.GetIDFromURL()
	var secret models.Secret
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &secret)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Secret")
	}

	secret.Id = int64(id)
	err = models.SecretModel.UpdateById(&secret)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(secret)
}

// @Title UpdateOrders
// @Description batch update the Orders
// @Param	body		body 	[]models.Secret	true		"The body"
// @Success 200 models.Deployment success
// @router /updateorders [put]
func (c *SecretController) UpdateOrders() {
	var secrets []*models.Secret
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &secrets)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("secrets")
	}

	err = models.SecretModel.UpdateOrders(secrets)
	if err != nil {
		logs.Error("update orders (%v) error.%v", secrets, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}

// @Title Delete
// @Description delete the Secret
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *SecretController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.SecretModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
