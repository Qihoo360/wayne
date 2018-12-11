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
	k8sClient, err := client.Client(clusterName)
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
	_, err = ingress.CreateOrUpdateService(k8sClient, &kubeIngress)
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
	})
	c.Success("ok")
}

func (c *KubeIngressController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":ingress")
	k8sClinet, err := client.Client(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
		return
	}
	res, err := ingress.GetServiceDetail(k8sClinet, name, namespace)
	if err != nil {
		logs.Error("get ingress error cluster: %s, namespace: %s", cluster, namespace)
		c.HandleError(err)
		return
	}
	c.Success(res)
}

func (c *KubeIngressController) Offline() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":ingress")
	k8sClient, err := client.Client(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
		return
	}
	if err = ingress.DeleteService(k8sClient, name, namespace); err != nil {
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
