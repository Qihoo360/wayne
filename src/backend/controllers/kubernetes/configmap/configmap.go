package configmap

import (
	"encoding/json"

	kapi "k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/configmap"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubeConfigMapController struct {
	base.APIController
}

func (c *KubeConfigMapController) URLMapping() {
	c.Mapping("Create", c.Create)
}

func (c *KubeConfigMapController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"Create": models.PermissionCreate,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeConfigMap)
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:configMapId/tpls/:tplId/clusters/:cluster [post]
func (c *KubeConfigMapController) Create() {
	configMapId := c.GetIntParamFromURL(":configMapId")
	tplId := c.GetIntParamFromURL(":tplId")
	var kubeConfigMap kapi.ConfigMap
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeConfigMap)
	if err != nil {
		logs.Error("Invalid configMap tpl %v", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequestFormat("KubeConfigMap")
	}

	cluster := c.Ctx.Input.Param(":cluster")
	cli := c.Client(cluster)

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

}
