package configmap

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/configmap"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	kapi "k8s.io/api/core/v1"
)

type KubeConfigMapController struct {
	base.APIController
}

func (c *KubeConfigMapController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("Offline", c.Offline)
	c.Mapping("Deploy", c.Deploy)
}

func (c *KubeConfigMapController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeConfigMap, perAction)
	}
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:configMapId/tpls/:tplId/clusters/:cluster [post]
func (c *KubeConfigMapController) Deploy() {
	configMapId := c.GetIntParamFromURL(":configMapId")
	tplId := c.GetIntParamFromURL(":tplId")
	var kubeConfigMap kapi.ConfigMap
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeConfigMap)
	if err != nil {
		logs.Error("Invalid configMap tpl %v", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequestFormat("KubeConfigMap")
	}

	cluster := c.Ctx.Input.Param(":cluster")
	cli, err := client.Client(cluster)
	if err == nil {
		publishHistory := &models.PublishHistory{
			Type:         models.PublishTypeConfigMap,
			ResourceId:   int64(configMapId),
			ResourceName: kubeConfigMap.Name,
			TemplateId:   int64(tplId),
			Cluster:      cluster,
			User:         c.User.Name,
		}
		defer models.PublishHistoryModel.Add(publishHistory)
		// 发布资源到k8s平台
		_, err = configmap.CreateOrUpdateConfigMap(cli, &kubeConfigMap)
		if err != nil {
			publishHistory.Status = models.ReleaseFailure
			publishHistory.Message = err.Error()
			c.HandleError(err)
			return
		} else {
			publishHistory.Status = models.ReleaseSuccess
			// 添加发布状态
			publishStatus := models.PublishStatus{
				ResourceId: int64(configMapId),
				TemplateId: int64(tplId),
				Type:       models.PublishTypeConfigMap,
				Cluster:    cluster,
			}
			err = models.PublishStatusModel.Publish(&publishStatus)
			if err != nil {
				logs.Error("publish publishStatus (%v) to db error.%v", publishStatus, err)
				c.HandleError(err)
				return
			}
		}

		c.Success("ok")
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Get
// @Description find ConfigMap by cluster
// @Success 200 {object} models.ConfigMap success
// @router /:configmap/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeConfigMapController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":configmap")
	cli, err := client.Client(cluster)
	if err == nil {
		result, err := configmap.GetConfigMapDetail(cli, name, namespace)

		if err != nil {
			logs.Error("get kubernetes configmap detail error.", cluster, namespace, name, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Delete
// @Description delete the ConfigMap
// @Param	cluster		path 	string	true		"the cluster want to delete"
// @Param	namespace		path 	string	true		"the namespace want to delete"
// @Param	configmap		path 	string	true		"the configmap name want to delete"
// @Success 200 {string} delete success!
// @router /:configmap/namespaces/:namespace/clusters/:cluster [delete]
func (c *KubeConfigMapController) Offline() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":configmap")
	cli, err := client.Client(cluster)
	if err == nil {
		err := configmap.DeleteConfigMap(cli, name, namespace)
		if err != nil {
			logs.Error("delete configmap (%s) by cluster (%s) error.%v", name, cluster, err)
			c.HandleError(err)
			return
		}
		c.Success("ok!")
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}
