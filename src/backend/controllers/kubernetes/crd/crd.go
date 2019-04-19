package crd

import (
	"encoding/json"

	apiextensions "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/crd"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubeCRDController struct {
	base.APIController
}

func (c *KubeCRDController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Get", c.Get)
	c.Mapping("Create", c.Create)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *KubeCRDController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"List":   models.PermissionRead,
		"Get":    models.PermissionRead,
		"Create": models.PermissionCreate,
		"Update": models.PermissionUpdate,
		"Delete": models.PermissionDelete,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeCustomResourceDefinition)
}

// @Title List CRD
// @Description find CRD by cluster
// @router / [get]
func (c *KubeCRDController) List() {
	cluster := c.Ctx.Input.Param(":cluster")
	param := c.BuildKubernetesQueryParam()
	cli := c.ApiextensionsClient(cluster)
	result, err := crd.GetCRDPage(cli, param)
	if err != nil {
		logs.Error("list CRD by cluster (%s) error.%v", cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title get CRD
// @Description find CRD by cluster
// @router /:name [get]
func (c *KubeCRDController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.ApiextensionsClient(cluster)

	result, err := cli.ApiextensionsV1beta1().CustomResourceDefinitions().Get(name, metaV1.GetOptions{})
	if err != nil {
		logs.Error("get CRD by cluster (%s) name(%s) error.%v", cluster, name, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Create
// @Description create CustomResourceDefinition
// @router / [post]
func (c *KubeCRDController) Create() {
	var tpl apiextensions.CustomResourceDefinition
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &tpl)
	if err != nil {
		c.AbortBadRequestFormat("CustomResourceDefinition")
	}
	cluster := c.Ctx.Input.Param(":cluster")
	cli := c.ApiextensionsClient(cluster)
	result, err := cli.ApiextensionsV1beta1().CustomResourceDefinitions().Create(&tpl)
	if err != nil {
		logs.Error("create CRD (%v) by cluster (%s) error.%v", tpl, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Update
// @Description update the CustomResourceDefinition
// @router /:name [put]
func (c *KubeCRDController) Update() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	var tpl apiextensions.CustomResourceDefinition
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &tpl)
	if err != nil {
		c.AbortBadRequestFormat("CustomResourceDefinition")
	}
	if name != tpl.Name {
		c.AbortBadRequestFormat("Name")
	}

	cli := c.ApiextensionsClient(cluster)
	result, err := cli.ApiextensionsV1beta1().CustomResourceDefinitions().Update(&tpl)
	if err != nil {
		logs.Error("update CRD (%v) by cluster (%s) error.%v", tpl, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Delete
// @Description delete the CustomResourceDefinition
// @Success 200 {string} delete success!
// @router /:name [delete]
func (c *KubeCRDController) Delete() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.ApiextensionsClient(cluster)
	err := cli.ApiextensionsV1beta1().CustomResourceDefinitions().Delete(name, &metaV1.DeleteOptions{})
	if err != nil {
		logs.Error("delete CRD (%s) by cluster (%s) error.%v", name, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")

}
