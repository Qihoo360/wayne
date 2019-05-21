package ingress

import (
	"encoding/json"

	kapiv1beta1 "k8s.io/api/extensions/v1beta1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/controllers/common"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	"github.com/Qihoo360/wayne/src/backend/resources/ingress"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/workers/webhook"
)

type KubeIngressController struct {
	base.APIController
}

func (c *KubeIngressController) URLMapping() {
	c.Mapping("Create", c.Create)
}

func (c *KubeIngressController) Prepare() {
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"Create": models.PermissionCreate,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeIngress)
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:ingressId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster [post]
func (c *KubeIngressController) Create() {
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
	k8sClient := c.Client(clusterName)

	namespaceModel, err := models.NamespaceModel.GetNamespaceByAppId(c.AppId)
	if err != nil {
		logs.Error("get getNamespaceMetaData error.%v", err)
		c.HandleError(err)
		return
	}

	clusterModel, err := models.ClusterModel.GetParsedMetaDataByName(clusterName)
	if err != nil {
		logs.Error("get cluster error.%v", err)
		c.HandleError(err)
		return
	}

	// add ingress predeploy
	common.IngressPreDeploy(&kubeIngress, clusterModel, namespaceModel)

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
	_, err = ingress.CreateOrUpdateIngress(k8sClient, &kubeIngress)
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
