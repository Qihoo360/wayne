package ingress

import (
	"encoding/json"
	"fmt"
	
	kapiv1beta1 "k8s.io/api/extensions/v1beta1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type IngressTplController struct {
	base.APIController
}

func (c *IngressTplController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *IngressTplController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeStatefulset, perAction)
	}
}

// @Title GetAll
// @Description get all ingressTpl
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted, default list all"
// @Success 200 {object} []models.ingressTemplate success
// @router / [get]
func (c *IngressTplController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	isOnline := c.GetIsOnlineFromQuery()

	ingressId := c.Input().Get("ingressId")
	if ingressId != "" {
		param.Query["ingress_id"] = ingressId
	}

	var ingrsTpls []models.IngressTemplate
	total, err := models.ListTemplate(&ingrsTpls, param, models.TableNameIngressTemplate, models.PublishTypeIngress, isOnline)
	if err != nil {
		logs.Error("list by param (%v) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for index, tpl := range ingrsTpls {
		ingrsTpls[index].IngressId = tpl.Ingress.Id
	}

	c.Success(param.NewPage(total, ingrsTpls))
}

// @Title Create
// @Description create ingressTpl
// @Param	body		body 	models.ingressTemplate	true		"The ingressTpl content"
// @Success 200 return models.ingressTemplate success
// @router / [post]
func (c *IngressTplController) Create() {
	var ingrTpl models.IngressTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &ingrTpl)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("ingressTemplate")
	}
	err = validIngressTemplate(ingrTpl.Template)
	if err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("Kubeingress")
	}

	ingrTpl.User = c.User.Name

	_, err = models.IngressTemplateModel.Add(&ingrTpl)
	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(ingrTpl)
}

func validIngressTemplate(ingrTplStr string) error {
	ingr := kapiv1beta1.Ingress{}
	err := json.Unmarshal(hack.Slice(ingrTplStr), &ingr)
	if err != nil {
		return fmt.Errorf("ingress template format error.%v", err.Error())
	}
	return nil
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.ingressTemplate success
// @router /:id([0-9]+) [get]
func (c *IngressTplController) Get() {
	id := c.GetIDFromURL()

	ingrTpl, err := models.IngressTemplateModel.GetById(id)
	if err != nil {
		logs.Error("get template error %v", err)
		c.HandleError(err)
		return
	}

	c.Success(ingrTpl)
}

// @Title Update
// @Description update the ingrTpl
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.ingrTemplate	true		"The body"
// @Success 200 models.ingrTemplate success
// @router /:id([0-9]+) [put]
func (c *IngressTplController) Update() {
	id := c.GetIDFromURL()
	var ingrTpl models.IngressTemplate
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &ingrTpl)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("IngressTemplate")
	}
	if err = validIngressTemplate(ingrTpl.Template); err != nil {
		logs.Error("valid template err %v", err)
		c.AbortBadRequestFormat("Kubeingress")
	}

	ingrTpl.Id = int64(id)
	err = models.IngressTemplateModel.UpdateById(&ingrTpl)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(ingrTpl)
}

// @Title Delete
// @Description delete the ingressTpl
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id([0-9]+) [delete]
func (c *IngressTplController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.IngressTemplateModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
