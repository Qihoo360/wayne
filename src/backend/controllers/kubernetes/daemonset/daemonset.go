package daemonset

import (
	"encoding/json"

	"k8s.io/api/extensions/v1beta1"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/daemonset"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubeDaemonSetController struct {
	base.APIController
}

func (c *KubeDaemonSetController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("Offline", c.Offline)
	c.Mapping("Deploy", c.Deploy)
}

func (c *KubeDaemonSetController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeDaemonSet, perAction)
	}
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:daemonSetId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster [post]
func (c *KubeDaemonSetController) Deploy() {
	daemonSetId := c.GetIntParamFromURL(":daemonSetId")
	tplId := c.GetIntParamFromURL(":tplId")

	var kubeDaemonSet v1beta1.DaemonSet
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeDaemonSet)
	if err != nil {
		c.AbortBadRequestFormat("KubeDaemonSet")
	}

	cluster := c.Ctx.Input.Param(":cluster")
	cli, err := client.Client(cluster)
	if err == nil {
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
		DaemonSetModel, err := models.DaemonSetModel.GetParseMetaDataById(int64(daemonSetId))
		if err != nil {
			logs.Error("get daemonSet error.%v", err)
			c.HandleError(err)
			return
		}
		daemonSetPreDeploy(&kubeDaemonSet, DaemonSetModel, clusterModel, namespaceModel)

		publishHistory := &models.PublishHistory{
			Type:         models.PublishTypeDaemonSet,
			ResourceId:   int64(daemonSetId),
			ResourceName: kubeDaemonSet.Name,
			TemplateId:   int64(tplId),
			Cluster:      cluster,
			User:         c.User.Name,
		}

		defer models.PublishHistoryModel.Add(publishHistory)

		// 发布资源到k8s平台
		_, err = daemonset.CreateOrUpdateDaemonSet(cli, &kubeDaemonSet)
		if err != nil {
			publishHistory.Status = models.ReleaseFailure
			publishHistory.Message = err.Error()
			logs.Error("deploy daemonSet error.%v", err)
			c.HandleError(err)
			return
		} else {
			publishHistory.Status = models.ReleaseSuccess
			err = addDeployStatus(daemonSetId, tplId, cluster)
			if err != nil {
				logs.Error("add daemonSet deploy status error.%v", err)
				c.HandleError(err)
				return
			}
		}
		c.Success("ok")
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

func addDeployStatus(daemonSetId int64, tplId int64, cluster string) error {
	// 添加发布状态
	publishStatus := models.PublishStatus{
		ResourceId: daemonSetId,
		TemplateId: tplId,
		Type:       models.PublishTypeDaemonSet,
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
// @Description find DaemonSet by cluster
// @Success 200 {object} models.DaemonSet success
// @router /:daemonSet/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeDaemonSetController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":daemonSet")
	manager, err := client.Manager(cluster)
	if err == nil {
		result, err := daemonset.GetDaemonSetDetail(manager.Client, manager.CacheFactory, name, namespace)
		if err != nil {
			logs.Error("get kubernetes daemonSet detail error.", cluster, namespace, name, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
		return
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Delete
// @Description delete the DaemonSet
// @Param	cluster		path 	string	true		"the cluster want to delete"
// @Param	namespace		path 	string	true		"the namespace want to delete"
// @Param	daemonSet		path 	string	true		"the daemonSet name want to delete"
// @Success 200 {string} delete success!
// @router /:daemonSet/namespaces/:namespace/clusters/:cluster [delete]
func (c *KubeDaemonSetController) Offline() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":daemonSet")
	cli, err := client.Client(cluster)
	if err == nil {
		err := daemonset.DeleteDaemonSet(cli, name, namespace)
		if err != nil {
			logs.Error("delete daemonSet (%s) by cluster (%s) error.%v", name, cluster, err)
			c.HandleError(err)
			return
		}
		c.Success("ok!")
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}
