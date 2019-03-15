package cronjob

import (
	"encoding/json"

	"k8s.io/api/batch/v1beta1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/cronjob"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubeCronjobController struct {
	base.APIController
}

func (c *KubeCronjobController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("Delete", c.Delete)
	c.Mapping("Create", c.Create)
	c.Mapping("Suspend", c.Suspend)
}

func (c *KubeCronjobController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"Get":     models.PermissionRead,
		"Delete":  models.PermissionDelete,
		"Create":  models.PermissionCreate,
		"Suspend": models.PermissionCreate,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeCronJob)
}

// @Title Suspend CronJob
// @Description Suspend CronJob
// @Success 200 return ok success
// @router /:cronjobId/tpls/:tplId/clusters/:cluster/suspend [post]
func (c *KubeCronjobController) Suspend() {
	cronjobId := c.GetIntParamFromURL(":cronjobId")
	tplId := c.GetIntParamFromURL(":tplId")
	cluster := c.Ctx.Input.Param(":cluster")

	cli := c.Client(cluster)

	namespaceModel, err := getNamespace(c.AppId)
	if err != nil {
		logs.Error("get getNamespaceMetaData error.%v", err)
		c.HandleError(err)
		return
	}
	cronjobModel, err := models.CronjobModel.GetParseMetaDataById(int64(cronjobId))
	if err != nil {
		logs.Error("get cronjob error.%v", err)
		c.HandleError(err)
		return
	}

	publishHistory := &models.PublishHistory{
		Type:         models.PublishTypeCronJob,
		ResourceId:   int64(cronjobId),
		ResourceName: cronjobModel.Name,
		TemplateId:   int64(tplId),
		Cluster:      cluster,
		User:         c.User.Name,
	}

	defer models.PublishHistoryModel.Add(publishHistory)

	// 更新Suspend状态为挂起
	err = cronjob.SuspendCronjob(cli, cronjobModel.Name, namespaceModel.KubeNamespace)

	if err != nil {
		publishHistory.Status = models.ReleaseFailure
		publishHistory.Message = err.Error()
		logs.Error("update cronjob Suspend error.%v", err)
		c.HandleError(err)
		return
	} else {
		publishHistory.Status = models.ReleaseSuccess
		err = addDeployStatus(cronjobId, tplId, cluster)
		if err != nil {
			logs.Error("add cronjob deploy status error.%v", err)
			c.HandleError(err)
			return
		}
	}

	c.Success("ok")
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:cronjobId/tpls/:tplId/clusters/:cluster [post]
func (c *KubeCronjobController) Create() {
	cronjobId := c.GetIntParamFromURL(":cronjobId")
	tplId := c.GetIntParamFromURL(":tplId")
	var kubeCronJob v1beta1.CronJob
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeCronJob)
	if err != nil {
		logs.Info("Invalid cronjob tpl %v", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequestFormat("KubeCronjob")
	}

	cluster := c.Ctx.Input.Param(":cluster")

	cli := c.Client(cluster)
	namespaceModel, err := getNamespace(c.AppId)
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
	cronjobModel, err := models.CronjobModel.GetParseMetaDataById(int64(cronjobId))
	if err != nil {
		logs.Error("get cronjob error.%v", err)
		c.HandleError(err)
		return
	}

	cronjobPreDeploy(&kubeCronJob, cronjobModel, clusterModel, namespaceModel)

	publishHistory := &models.PublishHistory{
		Type:         models.PublishTypeCronJob,
		ResourceId:   int64(cronjobId),
		ResourceName: kubeCronJob.Name,
		TemplateId:   int64(tplId),
		Cluster:      cluster,
		User:         c.User.Name,
	}

	defer models.PublishHistoryModel.Add(publishHistory)

	// 发布资源到k8s平台
	_, err = cronjob.CreateOrUpdateCronjob(cli, &kubeCronJob)

	if err != nil {
		publishHistory.Status = models.ReleaseFailure
		publishHistory.Message = err.Error()
		logs.Error("deploy cronjob error.%v", err)
		c.HandleError(err)
		return
	} else {
		publishHistory.Status = models.ReleaseSuccess
		err = addDeployStatus(cronjobId, tplId, cluster)
		if err != nil {
			logs.Error("add cronjob deploy status error.%v", err)
			c.HandleError(err)
			return
		}
	}

	c.Success("ok")

}

func addDeployStatus(id int64, tplId int64, cluster string) error {
	// 添加发布状态
	publishStatus := models.PublishStatus{
		ResourceId: id,
		TemplateId: tplId,
		Type:       models.PublishTypeCronJob,
		Cluster:    cluster,
	}
	err := models.PublishStatusModel.Publish(&publishStatus)
	if err != nil {
		logs.Error("publish publishStatus (%v) to db error.%v", publishStatus, err)
		return err
	}
	return nil
}

func getNamespace(appId int64) (*models.Namespace, error) {
	app, err := models.AppModel.GetById(appId)
	if err != nil {
		logs.Warning("get app by id (%d) error. %v", appId, err)
		return nil, err
	}

	ns, err := models.NamespaceModel.GetById(app.Namespace.Id)
	if err != nil {
		logs.Warning("get namespace by id (%d) error. %v", app.Namespace.Id, err)
		return nil, err
	}
	var namespaceMetaData models.NamespaceMetaData
	err = json.Unmarshal(hack.Slice(ns.MetaData), &namespaceMetaData)
	if err != nil {
		logs.Error("Unmarshal namespace metadata (%s) error. %v", ns.MetaData, err)
		return nil, err
	}
	ns.MetaDataObj = namespaceMetaData
	return ns, nil
}

// @Title Get
// @Description find Cronjob by cluster
// @Success 200 {object} models.Cronjob success
// @router /:cronjob/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeCronjobController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":cronjob")

	cli := c.Client(cluster)

	result, err := cronjob.GetCronjobDetail(cli, name, namespace)
	if err != nil {
		logs.Error("get kubernetes cronjob detail error.", cluster, namespace, name, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Delete
// @Description delete the Cronjob
// @Param	cluster		path 	string	true		"the cluster want to delete"
// @Param	namespace		path 	string	true		"the namespace want to delete"
// @Param	cronjob		path 	string	true		"the cronjob name want to delete"
// @Success 200 {string} delete success!
// @router /:cronjob/namespaces/:namespace/clusters/:cluster [delete]
func (c *KubeCronjobController) Delete() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":cronjob")
	cli := c.Client(cluster)

	err := cronjob.DeleteCronjob(cli, name, namespace)
	if err != nil {
		logs.Error("delete cronjob (%s) by cluster (%s) error.%v", name, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}
