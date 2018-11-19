package pvc

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/pvc"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	kapi "k8s.io/api/core/v1"
)

type KubePersistentVolumeClaimController struct {
	base.APIController
}

func (c *KubePersistentVolumeClaimController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("Offline", c.Offline)
	c.Mapping("Deploy", c.Deploy)
}

func (c *KubePersistentVolumeClaimController) Prepare() {
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
		c.CheckPermission(models.PermissionTypePersistentVolumeClaim, perAction)
	}
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:pvcId/tpls/:tplId/clusters/:cluster [post]
func (c *KubePersistentVolumeClaimController) Deploy() {
	pvcId := c.GetIntParamFromURL(":pvcId")
	tplId := c.GetIntParamFromURL(":tplId")
	var kubePersistentVolumeClaim kapi.PersistentVolumeClaim
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubePersistentVolumeClaim)
	if err != nil {
		logs.Error("Invalid pvc tpl %v", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequestFormat("PersistentVolumeClaim")
		return
	}

	cluster := c.Ctx.Input.Param(":cluster")
	cli, err := client.Client(cluster)
	if err == nil {
		publishHistory := &models.PublishHistory{
			Type:         models.PublishTypePersistentVolumeClaim,
			ResourceId:   int64(pvcId),
			ResourceName: kubePersistentVolumeClaim.Name,
			TemplateId:   int64(tplId),
			Cluster:      cluster,
			User:         c.User.Name,
		}
		defer models.PublishHistoryModel.Add(publishHistory)
		// 发布资源到k8s平台
		_, err = pvc.CreateOrUpdatePersistentVolumeClaim(cli, &kubePersistentVolumeClaim)

		if err != nil {
			publishHistory.Status = models.ReleaseFailure
			publishHistory.Message = err.Error()
			c.HandleError(err)
			return
		} else {
			publishHistory.Status = models.ReleaseSuccess
			// 添加发布状态
			publishStatus := models.PublishStatus{
				ResourceId: int64(pvcId),
				TemplateId: int64(tplId),
				Type:       models.PublishTypePersistentVolumeClaim,
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
// @Description find PersistentVolumeClaim by cluster
// @router /:pvc/namespaces/:namespace/clusters/:cluster [get]
func (c *KubePersistentVolumeClaimController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")
	cli, err := client.Client(cluster)
	if err == nil {
		result, err := pvc.GetPersistentVolumeClaimDetail(cli, name, namespace)
		if err != nil {
			logs.Error("get kubernetes pvc detail error.", cluster, namespace, name, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Delete
// @Description delete the PersistentVolumeClaim
// @Param	cluster		path 	string	true		"the cluster want to delete"
// @Param	namespace		path 	string	true		"the namespace want to delete"
// @Param	pvc		path 	string	true		"the pvc name want to delete"
// @Success 200 {string} delete success!
// @router /:pvc/namespaces/:namespace/clusters/:cluster [delete]
func (c *KubePersistentVolumeClaimController) Offline() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")
	cli, err := client.Client(cluster)
	if err == nil {
		err := pvc.DeletePersistentVolumeClaim(cli, name, namespace)
		if err != nil {
			logs.Error("delete pvc (%s) by cluster (%s) error.%v", name, cluster, err)
			c.HandleError(err)
			return
		}
		c.Success("ok!")
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}
