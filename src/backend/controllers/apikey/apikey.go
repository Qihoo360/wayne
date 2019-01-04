package apikey

import (
	"encoding/json"
	"time"

	"github.com/astaxie/beego"
	"github.com/dgrijalva/jwt-go"

	rsakey "github.com/Qihoo360/wayne/src/backend/apikey"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type ApiKeyController struct {
	base.APIController
}

func (c *ApiKeyController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("List", c.List)
	c.Mapping("Update", c.Update)
	c.Mapping("Create", c.Create)
	c.Mapping("Delete", c.Delete)
}

func (c *ApiKeyController) Prepare() {
	// Check administration
	c.APIController.Prepare()
	if beego.AppConfig.String("EnableApiKeys") != "true" {
		c.AbortForbidden("APIKey is not enabled. Please contact the administrator.")
	}

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
		c.CheckPermission(models.PermissionTypeAPIKey, perAction)
	}
}

// @Title List/
// @Description get all
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	deleted		query 	bool	false		"is deleted, default list all."
// @Success 200 {object} []models.APIKey success
// @router / [get]
func (c *ApiKeyController) List() {
	param := c.BuildQueryParam()

	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	apiKeyType := c.Input().Get("type")
	if apiKeyType != "" {
		param.Query["type"] = apiKeyType
	}

	resourceId := c.Input().Get("resourceId")
	if resourceId != "" {
		param.Query["ResourceId"] = resourceId
	}

	var apiKeys []models.APIKey

	param.Relate = "Group"
	total, err := models.GetTotal(new(models.APIKey), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.APIKey), &apiKeys, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	c.Success(param.NewPage(total, apiKeys))
	return
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.APIKey success
// @router /:id([0-9]+) [get]
func (c *ApiKeyController) Get() {
	id := c.GetIDFromURL()
	app, err := models.ApiKeyModel.GetById(int64(id))
	if err != nil {
		logs.Error("get apikey by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(app)
	return
}

// @Title Update
// @Description update the App
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.APIKey	true		"The body"
// @Success 200 models.APIKey success
// @router /:id [put]
func (c *ApiKeyController) Update() {
	id := c.GetIDFromURL()
	var apiKey models.APIKey
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &apiKey)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("APIKey")
	}

	apiKey.Id = int64(id)
	err = models.ApiKeyModel.UpdateById(&apiKey)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(apiKey)
}

// @Title Create
// @Description create APIKey
// @Param	body		body 	models.APIKey	true		"The APIKey content"
// @Success 200 return models.APIKey success
// @router / [post]
func (c *ApiKeyController) Create() {
	var apiKey models.APIKey
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &apiKey)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("APIKey")
	}

	apiKey.User = c.User.Name
	_, err = models.ApiKeyModel.Add(&apiKey)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		// 签发者
		"iss": "wayne",
		// 签发时间
		"iat": apiKey.CreateTime.Unix(),
		"exp": apiKey.CreateTime.Add(time.Duration(apiKey.ExpireIn) * time.Second).Unix(),
		"aud": apiKey.Id,
	})

	apiToken, err := token.SignedString(rsakey.RsaPrivateKey)
	if err != nil {
		logs.Error("create token form rsa private key  error.", rsakey.RsaPrivateKey, err.Error())
		c.HandleError(err)
		return
	}

	apiKey.Token = apiToken

	err = models.ApiKeyModel.UpdateById(&apiKey)
	if err != nil {
		logs.Error("update token error.%v", err.Error())
		c.HandleError(err)
		return
	}

	c.Success(apiKey)
}

// @Title Delete
// @Description delete the APIKey
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *ApiKeyController) Delete() {
	id := c.GetIDFromURL()

	logical := c.GetLogicalFromQuery()

	err := models.ApiKeyModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
