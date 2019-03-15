package pvc

import (
	"encoding/json"

	kapi "k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/pvc"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubePersistentVolumeClaimController struct {
	base.APIController
}

func (c *KubePersistentVolumeClaimController) URLMapping() {
	c.Mapping("Create", c.Create)
}

func (c *KubePersistentVolumeClaimController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"Create": models.PermissionCreate,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubePersistentVolumeClaim)
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:pvcId/tpls/:tplId/clusters/:cluster [post]
func (c *KubePersistentVolumeClaimController) Create() {
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
	cli := c.Client(cluster)
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
}
