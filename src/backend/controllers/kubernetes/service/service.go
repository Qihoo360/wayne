package service

import (
	"encoding/json"

	"k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/controllers/common"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	"github.com/Qihoo360/wayne/src/backend/resources/service"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/workers/webhook"
)

type KubeServiceController struct {
	base.APIController
}

func (c *KubeServiceController) URLMapping() {
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
}

func (c *KubeServiceController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"Create": models.PermissionCreate,
		"Get":    models.PermissionRead,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeService)
}

// @Title GetDetail
// @Description find Deployment by cluster
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	namespace		path 	string	true		"the namespace name"
// @Success 200 {object} service.ServiceDetail success
// @router /:service/detail/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeServiceController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":service")
	manager := c.Manager(cluster)
	serviceDetail, err := service.GetServiceDetail(manager.Client, manager.CacheFactory, namespace, name)
	if err != nil {
		logs.Error("get kubernetes(%s) namespace(%s) service(%s) detail error: %s", cluster, namespace, name, err.Error())
		c.AbortInternalServerError("get kubernetes service detail error.")
	}
	c.Success(serviceDetail)
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:serviceId/tpls/:tplId/clusters/:cluster [post]
func (c *KubeServiceController) Create() {
	serviceId := c.GetIntParamFromURL(":serviceId")
	tplId := c.GetIntParamFromURL(":tplId")
	var kubeService v1.Service
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeService)
	if err != nil {
		logs.Error("Invalid service tpl %v", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequestFormat("Service")
	}

	cluster := c.Ctx.Input.Param(":cluster")
	cli := c.Client(cluster)
	namespaceModel, err := models.NamespaceModel.GetNamespaceByAppId(c.AppId)
	if err != nil {
		logs.Error("get getNamespaceMetaData error.%v", err)
		c.HandleError(err)
		return
	}

	clusterModel, err := models.ClusterModel.GetParsedMetaDataByName(cluster)
	if err != nil {
		logs.Error("get cluster error.%v", err)
		c.HandleError(err)
		return
	}

	// add service predeploy
	common.ServicePreDeploy(&kubeService, clusterModel, namespaceModel)

	publishHistory := &models.PublishHistory{
		Type:         models.PublishTypeService,
		ResourceId:   int64(serviceId),
		ResourceName: kubeService.Name,
		TemplateId:   int64(tplId),
		Cluster:      cluster,
		User:         c.User.Name,
	}
	defer models.PublishHistoryModel.Add(publishHistory)
	// 发布资源到k8s平台
	_, err = service.CreateOrUpdateService(cli, &kubeService)

	if err != nil {
		publishHistory.Status = models.ReleaseFailure
		publishHistory.Message = err.Error()
		logs.Error("deploy service error.%v", err)
		c.HandleError(err)
		return
	} else {
		publishHistory.Status = models.ReleaseSuccess
		// 添加发布状态
		publishStatus := models.PublishStatus{
			ResourceId: int64(serviceId),
			TemplateId: int64(tplId),
			Type:       models.PublishTypeService,
			Cluster:    cluster,
		}
		err = models.PublishStatusModel.Publish(&publishStatus)
		if err != nil {
			logs.Error("publish publishStatus (%v) to db error.%v", publishStatus, err)
			c.HandleError(err)
			return
		}
	}
	webhook.PublishEventService(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.OnlineService, response.Resource{
		Type:         publishHistory.Type,
		ResourceId:   publishHistory.ResourceId,
		ResourceName: publishHistory.ResourceName,
		TemplateId:   publishHistory.TemplateId,
		Cluster:      publishHistory.Cluster,
		Status:       publishHistory.Status,
		Message:      publishHistory.Message,
		Object:       kubeService,
	})

	c.Success("ok")
}
