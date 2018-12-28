package service

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	"github.com/Qihoo360/wayne/src/backend/resources/service"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/workers/webhook"
	"k8s.io/api/core/v1"
)

type KubeServiceController struct {
	base.APIController
}

func (c *KubeServiceController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("Offline", c.Offline)
	c.Mapping("Deploy", c.Deploy)
	c.Mapping("GetDetail", c.GetDetail)
	c.Mapping("List", c.List)
}

func (c *KubeServiceController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Get":
		perAction = models.PermissionRead
	case "Deploy":
		perAction = models.PermissionDeploy
	case "Offline":
		perAction = models.PermissionOffline
	}
	if perAction != "" {
		c.CheckPermission(models.PermissionTypeService, perAction)
	}
}

// @Title GetDetail
// @Description find Deployment by cluster
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	namespace		path 	string	true		"the namespace name"
// @Success 200 {object} service.ServiceDetail success
// @router /:service/detail/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeServiceController) GetDetail() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":service")
	manager, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
	}
	serviceDetail, err := service.GetServiceDetail(manager.Client, manager.Indexer, namespace, name)
	if err != nil {
		logs.Error("get kubernetes(%s) namespace(%s) service(%s) detail error: %s", cluster, namespace, name, err.Error())
		c.AbortInternalServerError("get kubernetes service detail error.")
	}
	c.Success(serviceDetail)
}

// @Title List service
// @Description get all ingress in a kubernetes cluster
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	filter		query 	string	false		"column filter, ex. filter=name=test"
// @Param	sortby		query 	string	false		"column sorted by, ex. sortby=-id, '-' representation desc, and sortby=id representation asc"
// @Param	cluster		path 	string	true		"the cluster name"
// @Param	namespace		path 	string	true		"the namespace name"
// @Success 200 {object} common.Page success
// @router /namespaces/:namespace/clusters/:cluster [get]
func (c *KubeServiceController) List() {
	param := c.BuildQueryParam()
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")

	manager, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
	}
	res, err := service.GetServicePage(manager.Client, namespace, param)
	if err != nil {
		logs.Error("list kubernetes(%s) namespace(%s) services error %v", cluster, namespace, err)
		c.HandleError(err)
		return
	}
	c.Success(res)
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:serviceId/tpls/:tplId/clusters/:cluster [post]
func (c *KubeServiceController) Deploy() {
	serviceId := c.GetIntParamFromURL(":serviceId")
	tplId := c.GetIntParamFromURL(":tplId")
	var kubeService v1.Service
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeService)
	if err != nil {
		logs.Error("Invalid service tpl %v", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequestFormat("Service")
	}

	cluster := c.Ctx.Input.Param(":cluster")
	cli, err := client.Client(cluster)
	if err == nil {
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
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Get
// @Description find Service by cluster
// @Success 200 {object} models.Service success
// @router /:service/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeServiceController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":service")
	cli, err := client.Client(cluster)
	if err == nil {
		result, err := service.GetService(cli, name, namespace)
		if err != nil {
			logs.Error("get kubernetes service detail error.", cluster, namespace, name, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Delete
// @Description delete the Service
// @Param	cluster		path 	string	true		"the cluster want to delete"
// @Param	namespace		path 	string	true		"the namespace want to delete"
// @Param	service		path 	string	true		"the service name want to delete"
// @Success 200 {string} delete success!
// @router /:service/namespaces/:namespace/clusters/:cluster [delete]
func (c *KubeServiceController) Offline() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":service")
	cli, err := client.Client(cluster)
	if err == nil {
		err := service.DeleteService(cli, name, namespace)
		if err != nil {
			logs.Error("delete Service (%s) by cluster (%s) error.%v", name, cluster, err)
			c.HandleError(err)
			return
		}
		webhook.PublishEventService(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.OfflineService, response.Resource{
			Type:         models.PublishTypeService,
			ResourceName: name,
			Cluster:      cluster,
		})
		c.Success("ok!")
		return
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}
