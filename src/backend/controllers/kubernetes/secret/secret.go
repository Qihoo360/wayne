package secret

import (
	"encoding/json"

	kapi "k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/secret"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubeSecretController struct {
	base.APIController
}

func (c *KubeSecretController) URLMapping() {
	c.Mapping("Create", c.Create)
}

func (c *KubeSecretController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"Create": models.PermissionCreate,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeSecret)
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:secretId/tpls/:tplId/clusters/:cluster [post]
func (c *KubeSecretController) Create() {
	secretId := c.GetIntParamFromURL(":secretId")
	tplId := c.GetIntParamFromURL(":tplId")
	var kubeSecret kapi.Secret
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeSecret)
	if err != nil {
		logs.Error("Invalid secret tpl %v", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequestFormat("Secret")
	}

	cluster := c.Ctx.Input.Param(":cluster")
	cli := c.Client(cluster)
	publishHistory := &models.PublishHistory{
		Type:         models.PublishTypeSecret,
		ResourceId:   int64(secretId),
		ResourceName: kubeSecret.Name,
		TemplateId:   int64(tplId),
		Cluster:      cluster,
		User:         c.User.Name,
	}
	defer models.PublishHistoryModel.Add(publishHistory)
	// 发布资源到k8s平台
	_, err = secret.CreateOrUpdateSecret(cli, &kubeSecret)
	if err != nil {
		publishHistory.Status = models.ReleaseFailure
		publishHistory.Message = err.Error()
		c.HandleError(err)
		return
	} else {
		publishHistory.Status = models.ReleaseSuccess
		// 添加发布状态
		publishStatus := models.PublishStatus{
			ResourceId: int64(secretId),
			TemplateId: int64(tplId),
			Type:       models.PublishTypeSecret,
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
