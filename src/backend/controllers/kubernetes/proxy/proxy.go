package proxy

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"

	"github.com/Qihoo360/wayne/src/backend/client/api"
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

	methodActionMap := map[string]string{
		"Get":      models.PermissionRead,
		"List":     models.PermissionRead,
		"GetNames": models.PermissionRead,
		"Create":   models.PermissionCreate,
		"Update":   models.PermissionUpdate,
		"Delete":   models.PermissionDelete,
	}
	_, method := c.GetControllerAndAction()
	kind := c.Ctx.Input.Param(":kind")
	resourceMap, ok := api.KindToResourceMap[kind]
	if !ok {
		c.AbortBadRequest(fmt.Sprintf("Request resource kind (%s) not supported!", kind))
	}
	c.PreparePermission(methodActionMap, method, fmt.Sprintf("KUBE%s", strings.ToUpper(resourceMap.GroupVersionResourceKind.Kind)))
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
		logs.Info("Get kubernetes resource (%s:%s:%s) from cluster (%s) error. %v", kind, namespace, name, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)

}

// @Title Get all resource names
// @Description get all names
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	namespace		path 	string	true		"the namespace name"
// @Param	kind		path 	string	true		"the resource kind"
// @Success 200 {object} []response.NamesObject success
// @router /names [get]
func (c *KubeProxyController) GetNames() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	kind := c.Ctx.Input.Param(":kind")
	kubeClient := c.KubeClient(cluster)
	result, err := proxy.GetNames(kubeClient, kind, namespace)
	if err != nil {
		logs.Info("Get kubernetes resource names (%s:%s) from cluster (%s) error. %v", kind, namespace, cluster, err)
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
	param := c.BuildKubernetesQueryParam()
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
// @Param	force		query 	bool	false		"force to delete the resource from etcd."
// @Success 200 {string} delete success!
// @router /:name [delete]
func (c *KubeProxyController) Delete() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":name")
	kind := c.Ctx.Input.Param(":kind")
	force := c.Input().Get("force")
	defaultPropagationPolicy := meta_v1.DeletePropagationBackground
	defaultDeleteOptions := meta_v1.DeleteOptions{
		PropagationPolicy: &defaultPropagationPolicy,
	}
	if force != "" {
		forceBool, err := strconv.ParseBool(force)
		if err != nil {
			c.AbortBadRequestFormat("force")
		}
		if forceBool {
			var gracePeriodSeconds int64 = 0
			defaultDeleteOptions.GracePeriodSeconds = &gracePeriodSeconds
		}
	}
	kubeClient := c.KubeClient(cluster)
	err := kubeClient.Delete(kind, namespace, name, &defaultDeleteOptions)
	if err != nil {
		logs.Error("Delete kubernetes resource (%s:%s:%s) from cluster (%s) error. %v", kind, namespace, name, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}
