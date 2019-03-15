package hpa

import (
	"encoding/json"

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
	c.Mapping("Create", c.Create)
}

func (c *KubeHPAController) Prepare() {
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"Create": models.PermissionCreate,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeHorizontalPodAutoscaler)
}

// @router /:hpaId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster [post]
func (c *KubeHPAController) Create() {
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
	k8sClient := c.Client(clusterName)
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
