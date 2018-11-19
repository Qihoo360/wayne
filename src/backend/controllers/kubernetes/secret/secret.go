package secret

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/secret"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	kapi "k8s.io/api/core/v1"
)

type KubeSecretController struct {
	base.APIController
}

func (c *KubeSecretController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("Offline", c.Offline)
	c.Mapping("Deploy", c.Deploy)
}

func (c *KubeSecretController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeSecret, perAction)
	}
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:secretId/tpls/:tplId/clusters/:cluster [post]
func (c *KubeSecretController) Deploy() {
	secretId := c.GetIntParamFromURL(":secretId")
	tplId := c.GetIntParamFromURL(":tplId")
	var kubeSecret kapi.Secret
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeSecret)
	if err != nil {
		logs.Error("Invalid secret tpl %v", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequestFormat("Secret")
	}

	cluster := c.Ctx.Input.Param(":cluster")
	cli, err := client.Client(cluster)
	if err == nil {
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
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Get
// @Description find Secret by cluster
// @Success 200 {object} models.Secret success
// @router /:secret/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeSecretController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":secret")
	cli, err := client.Client(cluster)
	if err == nil {
		result, err := secret.GetSecretDetail(cli, name, namespace)

		if err != nil {
			logs.Error("get kubernetes secret detail error.", cluster, namespace, name, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Delete
// @Description delete the secret
// @Param	cluster		path 	string	true		"the cluster want to delete"
// @Param	namespace		path 	string	true		"the namespace want to delete"
// @Param	secret		path 	string	true		"the secret name want to delete"
// @Success 200 {string} delete success!
// @router /:secret/namespaces/:namespace/clusters/:cluster [delete]
func (c *KubeSecretController) Offline() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":secret")
	cli, err := client.Client(cluster)
	if err == nil {
		err := secret.DeleteSecret(cli, name, namespace)
		if err != nil {
			logs.Error("delete secret (%s) by cluster (%s) error.%v", name, cluster, err)
			c.HandleError(err)
			return
		}
		c.Success("ok!")
		return
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}
