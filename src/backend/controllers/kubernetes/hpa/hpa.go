package hpa

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/hpa"
	"github.com/Qihoo360/wayne/src/backend/util/logs"

	autoscaling "k8s.io/api/autoscaling/v1"
)

type KubeHPAController struct {
	base.APIController
}

func (c *KubeHPAController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("Offline", c.Offline)
	c.Mapping("Deploy", c.Deploy)
	c.Mapping("List", c.List)
	c.Mapping("GetDetail", c.GetDetail)
}

func (c *KubeHPAController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeHPA, perAction)
	}
}

// @router /namespaces/:namespace/clusters/:cluster [get]
func (c *KubeHPAController) List() {
	param := c.BuildQueryParam()
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")

	k8sClient, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
	}
	res, err := hpa.GetHPAPage(k8sClient.CacheFactory, namespace, param)
	if err != nil {
		logs.Error("list kubernetes(%s) namespace(%s) HPA error %v", cluster, namespace, err)
		c.HandleError(err)
		return
	}
	c.Success(res)
}

// @router /:hpaId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster [post]
func (c *KubeHPAController) Deploy() {
	hpaId := c.GetIntParamFromURL(":hpaId")
	tplId := c.GetIntParamFromURL(":tplId")
	var kubeHPA autoscaling.HorizontalPodAutoscaler
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeHPA)
	if err != nil {
		logs.Error("Invalid server tpl %s", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequest("HPA")
		return
	}
	clusterName := c.Ctx.Input.Param(":cluster")
	k8sClient, err := client.Client(clusterName)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
		return
	}
	publishHistory := &models.PublishHistory{
		Type:         models.PublishTypeHPA,
		ResourceId:   int64(hpaId),
		ResourceName: kubeHPA.Name,
		TemplateId:   int64(tplId),
		Cluster:      clusterName,
		User:         c.User.Name,
	}
	defer func() {
		if _, err := models.PublishHistoryModel.Add(publishHistory); err != nil {
			logs.Critical("insert log into database failed: %s", err)
		}
	}()

	_, err = hpa.CreateOrUpdateHPA(k8sClient, &kubeHPA)
	if err != nil {
		publishHistory.Status = models.ReleaseFailure
		publishHistory.Message = err.Error()
		logs.Error("deploy HPA error. %v", err)
		c.HandleError(err)
		return
	}

	publishHistory.Status = models.ReleaseSuccess
	publishStatus := models.PublishStatus{
		ResourceId: int64(hpaId),
		TemplateId: int64(tplId),
		Type:       models.PublishTypeHPA,
		Cluster:    clusterName,
	}
	err = models.PublishStatusModel.Publish(&publishStatus)
	if err != nil {
		logs.Error("publish publishStatus (%v) to db error .%v", publishStatus, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}

// @router /:hpa/detail/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeHPAController) GetDetail() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":hpa")
	k8sClient, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
	}
	res, err := hpa.GetHPADetail(k8sClient.CacheFactory, name, namespace)
	if err != nil {
		logs.Error("get kubernetes HPA detail err %v", err)
		c.HandleError(err)
		return
	}
	c.Success(res)
}

// @router /:hpa/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeHPAController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":hpa")
	k8sClient, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
		return
	}
	res, err := hpa.GetHPA(k8sClient.CacheFactory, name, namespace)
	if err != nil {
		logs.Error("get HPA error cluster: %s, namespace: %s", cluster, namespace)
		c.HandleError(err)
		return
	}
	c.Success(res)
}

// @router /:hpa/namespaces/:namespace/clusters/:cluster [delete]
func (c *KubeHPAController) Offline() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":hpa")
	k8sClient, err := client.Client(cluster)
	if err != nil {
		c.AbortBadRequestFormat("Cluster")
		return
	}
	if err = hpa.DeleteHPA(k8sClient, name, namespace); err != nil {
		logs.Error("delete HPA: %s in namespace: %s, error: %s", name, namespace, err.Error())
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
