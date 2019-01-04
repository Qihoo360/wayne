package secret

import (
	"encoding/json"
	"fmt"

	"k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type SecretTplController struct {
	base.APIController
}

func (c *SecretTplController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *SecretTplController) Prepare() {
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

// @Title GetAll
// @Description get all SecretTemplate
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted"
// @Success 200 {object} []models.SecretTemplate success
// @router / [get]
func (c *SecretTplController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	isOnline := c.GetIsOnlineFromQuery()

	secretId := c.Input().Get("secretId")
	if secretId != "" {
		param.Query["secret_map_id"] = secretId
	}

	var secretTpls []models.SecretTemplate
	total, err := models.ListTemplate(&secretTpls, param, models.TableNameSecretTemplate, models.PublishTypeSecret, isOnline)
	if err != nil {
		logs.Error("list by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for index, tpl := range secretTpls {
		secretTpls[index].SecretId = tpl.Secret.Id
	}

	c.Success(param.NewPage(total, secretTpls))
	return
}

// @Title Create
// @Description create SecretTemplate
// @Param	body		body 	models.SecretTemplate	true		"The SecretTemplate content"
// @Success 200 return models.SecretTemplate success
// @router / [post]
func (c *SecretTplController) Create() {
	var secretTpl models.SecretTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &secretTpl)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("SecretTemplate")
	}
	if err = validSecretTemplate(secretTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeSecretTemplate")
	}

	secretTpl.User = c.User.Name
	_, err = models.SecretTplModel.Add(&secretTpl)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(secretTpl)
}

func validSecretTemplate(templateStr string) error {
	secret := v1.Secret{}
	err := json.Unmarshal(hack.Slice(templateStr), &secret)
	if err != nil {
		return fmt.Errorf("secretTpl template format error.%v", err.Error())
	}
	return nil
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.SecretTemplate success
// @router /:id([0-9]+) [get]
func (c *SecretTplController) Get() {
	id := c.GetIDFromURL()

	secretTpl, err := models.SecretTplModel.GetById(int64(id))
	if err != nil {
		logs.Error("get template error %v", err)
		c.HandleError(err)
		return
	}

	c.Success(secretTpl)
	return
}

// @Title Update
// @Description update the SecretTemplate
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.SecretTemplate	true		"The body"
// @Success 200 models.SecretTemplate success
// @router /:id [put]
func (c *SecretTplController) Update() {
	id := c.GetIDFromURL()
	var secretTpl models.SecretTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &secretTpl)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("SecretTemplate")
	}
	if err = validSecretTemplate(secretTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("KubeSecretTemplate")
	}

	secretTpl.Id = int64(id)
	err = models.SecretTplModel.UpdateById(&secretTpl)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(secretTpl)
}

// @Title Delete
// @Description delete the SecretTemplate
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *SecretTplController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.SecretTplModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
