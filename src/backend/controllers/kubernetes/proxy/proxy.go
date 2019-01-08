package proxy

import (
	"encoding/json"

	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/proxy"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubeProxyController struct {
	base.APIController
}

func (c *KubeProxyController) URLMapping() {
	c.Mapping("Create", c.Create)
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("Get", c.Get)
	c.Mapping("Delete", c.Delete)
	c.Mapping("Update", c.Update)
	c.Mapping("List", c.List)
}

func (c *KubeProxyController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Get", "List", "GetNames":
		perAction = models.PermissionRead
	case "Create", "Update":
		perAction = models.PermissionDeploy
	case "Delete":
		perAction = models.PermissionOffline
	}
	if perAction != "" {
		c.CheckPermission(models.PermissionTypeDeployment, perAction)
	}

}

// @Title Get
// @Description Find Object by name
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	namespace		path 	string	true		"the namespace name"
// @Param	kind		path 	string	true		"the resource kind"
// @Param	name		path 	string	true		"the resource name"
// @Success 200 {object}  success
// @router /:name [get]
func (c *KubeProxyController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":name")
	kind := c.Ctx.Input.Param(":kind")
	kubeClient := c.KubeClient(cluster)
	result, err := kubeClient.Get(kind, namespace, name)
	if err != nil {
		logs.Error("Get kubernetes resource (%s:%s:%s) from cluster (%s) error. %v", kind, namespace, name, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)

}

// @Title Get all resource names
// @Description get all names
// @Success 200 {object} []response.NamesObject success
// @router /names [get]
func (c *KubeProxyController) GetNames() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	kind := c.Ctx.Input.Param(":kind")
	kubeClient := c.KubeClient(cluster)
	result, err := proxy.GetNames(kubeClient, kind, namespace)
	if err != nil {
		logs.Error("Get kubernetes resource names (%s:%s) from cluster (%s) error. %v", kind, namespace, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title List
// @Description List Objects
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	filter		query 	string	false		"the labelSelector for list e.g. filter=app=infra-wayne,wayne-app=infra"
// @Param	labelSelector		query 	string	false		"labelSelector, ex. labelSelector=name=test"
// @Param	sortby		query 	string	false		"column sorted by, ex. sortby=-id, '-' representation desc, and sortby=id representation asc"
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	namespace		path 	string	true		"the namespace name"
// @Param	kind		path 	string	true		"the resource kind"
// @Success 200 {object}  success
// @router / [get]
func (c *KubeProxyController) List() {
	param := c.BuildQueryParam()
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	kind := c.Ctx.Input.Param(":kind")
	kubeClient := c.KubeClient(cluster)
	result, err := proxy.GetPage(kubeClient, kind, namespace, param)
	if err != nil {
		logs.Error("List kubernetes resource (%s:%s) from cluster (%s) error. %v", kind, namespace, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)

}

// @Title Create
// @Description Create the resource
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	kind		path 	string	true		"the resource kind"
// @Param	namespace		path 	string	true		"the namespace name"
// @Param	name		path 	string	true		"the resource name"
// @Param	resource		body 	string	false		"the kubernetes resource"
// @Success 200 {string} delete success!
// @router / [post]
func (c *KubeProxyController) Create() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	kind := c.Ctx.Input.Param(":kind")
	var object runtime.Unknown
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &object)
	if err != nil {
		c.AbortBadRequestFormat(err.Error())
	}

	kubeClient := c.KubeClient(cluster)
	result, err := kubeClient.Create(kind, namespace, &object)
	if err != nil {
		logs.Error("Create kubernetes resource (%s:%s) from cluster (%s) error. %v", kind, namespace, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Update
// @Description Update the resource
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	kind		path 	string	true		"the resource kind"
// @Param	namespace		path 	string	true		"the namespace name"
// @Param	name		path 	string	true		"the resource name"
// @Param	resource		body 	string	false		"the kubernetes resource"
// @Success 200 {string} delete success!
// @router /:name [put]
func (c *KubeProxyController) Update() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":name")
	kind := c.Ctx.Input.Param(":kind")
	var object runtime.Unknown
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &object)
	if err != nil {
		c.AbortBadRequestFormat("object")
	}
	kubeClient := c.KubeClient(cluster)
	result, err := kubeClient.Update(kind, namespace, name, &object)
	if err != nil {
		logs.Error("Update kubernetes resource (%s:%s:%s) from cluster (%s) error. %v", kind, namespace, name, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Delete
// @Description delete the resource
// @Param	cluster		path 	string	true		"the cluster want to delete"
// @Param	kind		path 	string	true		"the resource kind"
// @Param	namespace		path 	string	true		"the namespace want to delete"
// @Param	name		path 	string	true		"the name want to delete"
// @Param	deleteOptions		body 	string	false		"the kubernetes delete options"
// @Success 200 {string} delete success!
// @router /:name [delete]
func (c *KubeProxyController) Delete() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":name")
	kind := c.Ctx.Input.Param(":kind")
	var deleteOptions meta_v1.DeleteOptions
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &deleteOptions)
	if err != nil {
		c.AbortBadRequestFormat("deleteOptions")
	}
	kubeClient := c.KubeClient(cluster)
	err = kubeClient.Delete(kind, namespace, name, &deleteOptions)
	if err != nil {
		logs.Error("Delete kubernetes resource (%s:%s:%s) from cluster (%s) error. %v", kind, namespace, name, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}
