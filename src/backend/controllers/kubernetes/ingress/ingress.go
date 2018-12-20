package ingress

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	"github.com/Qihoo360/wayne/src/backend/resources/ingress"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/workers/webhook"
	kapiv1beta1 "k8s.io/api/extensions/v1beta1"
)

type KubeIngressController struct {
	base.APIController
}

func (c *KubeIngressController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("Offline", c.Offline)
	c.Mapping("Deploy", c.Deploy)
	c.Mapping("List", c.List)
	c.Mapping("GetDetail", c.GetDetail)
}

func (c *KubeIngressController) Prepare() {
	c.APIController.Prepare()
	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Get":
		perAction = models.PermissionRead
	case "Deploy":
		perAction = models.PermissionDeploy
	case "offline":
		perAction = models.PermissionOffline
	}
	if perAction != "" {
		c.CheckPermission(models.PermissionTypeService, perAction)
	}
}

// @Title List ingress
// @Description get all ingress in a kubernetes cluster
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	filter		query 	string	false		"column filter, ex. filter=name=test"
// @Param	sortby		query 	string	false		"column sorted by, ex. sortby=-id, '-' representation desc, and sortby=id representation asc"
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	namespace		path 	string	true		"the namespace name"
// @Success 200 {object} common.Page success
// @router /namespaces/:namespace/clusters/:cluster [get]
func (c *KubeIngressController) List() {
	param := c.BuildQueryParam()
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")

	manager, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
	}
	res, err := ingress.GetIngressPage(manager.Client, namespace, param)
	if err != nil {
		logs.Error("list kubernetes(%s) namespace(%s) ingresses error %v", cluster, namespace, err)
		c.HandleError(err)
		return
	}
	c.Success(res)
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:ingressId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster [post]
func (c *KubeIngressController) Deploy() {
	ingressId := c.GetIntParamFromURL(":ingressId")
	tplId := c.GetIntParamFromURL(":tplId")
	var kubeIngress kapiv1beta1.Ingress
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeIngress)
	if err != nil {
		logs.Error("Invalid server tpl %s", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequest("Ingress")
		return
	}
	clusterName := c.Ctx.Input.Param(":cluster")
	manager, err := client.Manager(clusterName)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
		return
	}
	publishHistory := &models.PublishHistory{
		Type:         models.PublishTypeIngress,
		ResourceId:   int64(ingressId),
		ResourceName: kubeIngress.Name,
		TemplateId:   int64(tplId),
		Cluster:      clusterName,
		User:         c.User.Name,
	}
	defer func() {
		if _, err := models.PublishHistoryModel.Add(publishHistory); err != nil {
			logs.Critical("insert log into database failed: %s", err)
		}
	}()
	// ingressDetail include endpoints
	_, err = ingress.CreateOrUpdateIngress(manager.Client, &kubeIngress)
	if err != nil {
		publishHistory.Status = models.ReleaseFailure
		publishHistory.Message = err.Error()
		logs.Error("deploy ingress error. %v", err)
		c.HandleError(err)
		return
	}

	publishHistory.Status = models.ReleaseSuccess
	publishStatus := models.PublishStatus{
		ResourceId: int64(ingressId),
		TemplateId: int64(tplId),
		Type:       models.PublishTypeIngress,
		Cluster:    clusterName,
	}
	err = models.PublishStatusModel.Publish(&publishStatus)
	if err != nil {
		logs.Error("publish publishStatus (%v) to db error .%v", publishStatus, err)
		c.HandleError(err)
		return
	}
	webhook.PublishEventIngress(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.OnlineIngress, response.Resource{
		Type:         publishHistory.Type,
		ResourceId:   publishHistory.ResourceId,
		ResourceName: publishHistory.ResourceName,
		TemplateId:   publishHistory.TemplateId,
		Cluster:      publishHistory.Cluster,
		Status:       publishHistory.Status,
		Message:      publishHistory.Message,
		Object:       kubeIngress,
	})
	c.Success("ok")
}

// @Title GetDetail
// @Description find ingress detail in kubernetes
// @Param ingress path string true "the ingress name"
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	namespace		path 	string	true		"the namespace name"
// @Success 200 {object} ingress.Ingress success
// @router /:ingress/detail/namespaces/:namespace/clusters/:cluster [get]

func (c *KubeIngressController) GetDetail() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":ingress")
	manager, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequest("Cluster")
	}
	res, err := ingress.GetIngressDetail(manager.Client, name, namespace)
	if err != nil {
		logs.Error("get kubernetes ingress detail err %v", err)
		c.HandleError(err)
		return
	}
	c.Success(res)
}

// @Title Get
// @Description find Deployment by cluster
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	namespace		path 	string	true		"the namespace name"
// @Success 200 {object} models.Deployment success
// @router /:ingress/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeIngressController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":ingress")
	manager, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
		return
	}
	res, err := ingress.GetIngress(manager.Client, name, namespace)
	if err != nil {
		logs.Error("get ingress error cluster: %s, namespace: %s", cluster, namespace)
		c.HandleError(err)
		return
	}
	c.Success(res)
}

// @Title Delete
// @Description delete the Ingress
// @Param	cluster		path 	string	true		"the cluster want to delete"
// @Param	namespace		path 	string	true		"the namespace want to delete"
// @Param	deployment		path 	string	true		"the deployment name want to delete"
// @Success 200 {string} delete success!
// @router /:ingress/namespaces/:namespace/clusters/:cluster [delete]
func (c *KubeIngressController) Offline() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":ingress")
	manager, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
		return
	}
	if err = ingress.DeleteIngress(manager.Client, name, namespace); err != nil {
		logs.Error("delete ingress: %s in namespace: %s, error: %s", name, namespace, err.Error())
		c.HandleError(err)
		return
	}
	webhook.PublishEventIngress(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.OfflineIngress, response.Resource{
		Type:         models.PublishTypeIngress,
		ResourceName: name,
		Cluster:      cluster,
	})
	c.Success("OK")
}
