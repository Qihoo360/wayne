package statefulset

import (
	"encoding/json"
	"fmt"
	"net/http"

	"k8s.io/api/apps/v1beta1"
	"k8s.io/apimachinery/pkg/labels"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response/errors"
	"github.com/Qihoo360/wayne/src/backend/resources/namespace"
	"github.com/Qihoo360/wayne/src/backend/resources/statefulset"
	"github.com/Qihoo360/wayne/src/backend/util"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubeStatefulsetController struct {
	base.APIController
}

func (c *KubeStatefulsetController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("Create", c.Create)
}

func (c *KubeStatefulsetController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"Create": models.PermissionCreate,
		"Get":    models.PermissionRead,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeStatefulSet)
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:statefulsetId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster [post]
func (c *KubeStatefulsetController) Create() {
	statefulsetId := c.GetIntParamFromURL(":statefulsetId")
	tplId := c.GetIntParamFromURL(":tplId")

	var kubeStatefulset v1beta1.StatefulSet
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeStatefulset)
	if err != nil {
		logs.Error("Invalid statefulset tpl %v", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequestFormat("StatefulSet")
	}

	cluster := c.Ctx.Input.Param(":cluster")
	cli := c.Manager(cluster)

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
	statefulsetModel, err := models.StatefulsetModel.GetParseMetaDataById(int64(statefulsetId))
	if err != nil {
		logs.Error("get statefulset error.%v", err)
		c.HandleError(err)
		return
	}
	statefulsetPreDeploy(&kubeStatefulset, statefulsetModel, clusterModel, namespaceModel)

	publishHistory := &models.PublishHistory{
		Type:         models.PublishTypeStatefulSet,
		ResourceId:   int64(statefulsetId),
		ResourceName: kubeStatefulset.Name,
		TemplateId:   int64(tplId),
		Cluster:      cluster,
		User:         c.User.Name,
	}

	defer models.PublishHistoryModel.Add(publishHistory)

	err = checkResourceAvailable(namespaceModel, cli.KubeClient, &kubeStatefulset, cluster)
	if err != nil {
		publishHistory.Status = models.ReleaseFailure
		publishHistory.Message = err.Error()
		c.HandleError(err)
		return
	}

	// 发布资源到k8s平台
	_, err = statefulset.CreateOrUpdateStatefulset(cli.Client, &kubeStatefulset)
	if err != nil {
		publishHistory.Status = models.ReleaseFailure
		publishHistory.Message = err.Error()
		logs.Error("deploy statefulset error.%v", err)
		c.HandleError(err)
		return
	}
	publishHistory.Status = models.ReleaseSuccess
	err = addDeployStatus(statefulsetId, tplId, cluster)
	if err != nil {
		logs.Error("add statefulset deploy status error.%v", err)
		c.HandleError(err)
		return
	}
	err = updateMetadata(*kubeStatefulset.Spec.Replicas, statefulsetModel, cluster)
	if err != nil {
		logs.Error("update statefulset metadata error.%v", err)
		c.HandleError(err)
		return
	}

	c.Success("ok")

}

func addDeployStatus(statefulsetId int64, tplId int64, cluster string) error {
	// 添加发布状态
	publishStatus := models.PublishStatus{
		ResourceId: statefulsetId,
		TemplateId: tplId,
		Type:       models.PublishTypeStatefulSet,
		Cluster:    cluster,
	}
	err := models.PublishStatusModel.Publish(&publishStatus)
	if err != nil {
		logs.Error("publish publishStatus (%v) to db error.%v", publishStatus, err)
		return err
	}
	return nil
}

func checkResourceAvailable(ns *models.Namespace, cli client.ResourceHandler, kubeStatefulset *v1beta1.StatefulSet, cluster string) error {
	// this namespace can't use current cluster.
	clusterMetas, ok := ns.MetaDataObj.ClusterMetas[cluster]
	if !ok {
		return &errors.ErrorResult{
			Code:    http.StatusForbidden,
			SubCode: http.StatusForbidden,
			Msg:     fmt.Sprintf("Current namespace (%s) can't use current cluster (%s).Please contact administrator. ", ns.Name, cluster),
		}
	}

	// check resources
	selector := labels.SelectorFromSet(map[string]string{
		util.NamespaceLabelKey: ns.Name,
	})
	namespaceResourceUsed, err := namespace.ResourcesUsageByNamespace(cli, ns.KubeNamespace, selector.String())

	requestResourceList, err := statefulset.GetStatefulsetResource(cli, kubeStatefulset)
	if err != nil {
		logs.Error("get statefulset (%v) resource list error.%v", kubeStatefulset, err)
		return err
	}

	if clusterMetas.ResourcesLimit.Memory != 0 &&
		clusterMetas.ResourcesLimit.Memory-(namespaceResourceUsed.Memory+requestResourceList.Memory)/(1024*1024*1024) < 0 {
		return &errors.ErrorResult{
			Code:    http.StatusForbidden,
			SubCode: base.ErrorSubCodeInsufficientResource,
			Msg:     fmt.Sprintf("request namespace resource (memory:%dGi) is not enough for this deploy", requestResourceList.Memory/(1024*1024*1024)),
		}
	}

	if clusterMetas.ResourcesLimit.Cpu != 0 &&
		clusterMetas.ResourcesLimit.Cpu-(namespaceResourceUsed.Cpu+requestResourceList.Cpu)/1000 < 0 {
		return &errors.ErrorResult{
			Code:    http.StatusForbidden,
			SubCode: base.ErrorSubCodeInsufficientResource,
			Msg:     fmt.Sprintf("request namespace resource (cpu:%d) is not enough for this deploy", requestResourceList.Cpu/1000),
		}
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

func updateMetadata(replicas int32, statefulset *models.Statefulset, cluster string) (err error) {
	statefulset.MetaDataObj.Replicas[cluster] = replicas
	newMetaData, err := json.Marshal(&statefulset.MetaDataObj)
	if err != nil {
		logs.Error("statefulset metadata marshal error.%v", err)
		return
	}
	statefulset.MetaData = string(newMetaData)
	err = models.StatefulsetModel.UpdateById(statefulset)
	if err != nil {
		logs.Error("statefulset metadata update error.%v", err)
	}
	return
}

// @Title Get
// @Description find Statefulset by cluster
// @Success 200 {object} models.Statefulset success
// @router /:statefulset/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeStatefulsetController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":statefulset")
	manager := c.Manager(cluster)
	result, err := statefulset.GetStatefulsetDetail(manager.Client, manager.CacheFactory, name, namespace)
	if err != nil {
		logs.Error("get kubernetes statefulset detail error.", cluster, namespace, name, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}
