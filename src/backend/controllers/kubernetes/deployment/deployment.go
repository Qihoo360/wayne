package deployment

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/controllers/common"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	"github.com/Qihoo360/wayne/src/backend/resources/deployment"
	"github.com/Qihoo360/wayne/src/backend/resources/namespace"
	"github.com/Qihoo360/wayne/src/backend/util"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/workers/webhook"
	"k8s.io/api/apps/v1beta1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/kubernetes"
)

type KubeDeploymentController struct {
	base.APIController
}

func (c *KubeDeploymentController) URLMapping() {
	c.Mapping("Get", c.Get)
	c.Mapping("Offline", c.Offline)
	c.Mapping("Deploy", c.Deploy)
}

func (c *KubeDeploymentController) Prepare() {
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
		c.CheckPermission(models.PermissionTypeDeployment, perAction)
	}
}

// @Title deploy
// @Description deploy tpl
// @Param	body	body 	string	true	"The tpl content"
// @Success 200 return ok success
// @router /:deploymentId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster [post]
func (c *KubeDeploymentController) Deploy() {
	deploymentId := c.GetIntParamFromURL(":deploymentId")
	tplId := c.GetIntParamFromURL(":tplId")

	var kubeDeployment v1beta1.Deployment
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &kubeDeployment)
	if err != nil {
		logs.Error("Invalid deployment tpl %v", string(c.Ctx.Input.RequestBody))
		c.AbortBadRequestFormat("KubeDeployment")
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

		deploymentModel, err := models.DeploymentModel.GetParseMetaDataById(int64(deploymentId))
		if err != nil {
			logs.Error("get deployment error.%v", err)
			c.HandleError(err)
			return
		}

		common.DeploymentPreDeploy(&kubeDeployment, deploymentModel, clusterModel, namespaceModel)

		publishHistory := &models.PublishHistory{
			Type:         models.PublishTypeDeployment,
			ResourceId:   int64(deploymentId),
			ResourceName: kubeDeployment.Name,
			TemplateId:   int64(tplId),
			Cluster:      cluster,
			User:         c.User.Name,
		}

		defer models.PublishHistoryModel.Add(publishHistory)

		err = checkResourceAvailable(namespaceModel, cli, &kubeDeployment, cluster)
		if err != nil {
			publishHistory.Status = models.ReleaseFailure
			publishHistory.Message = err.Error()
			c.HandleError(err)
			return
		}

		// 发布资源到k8s平台
		_, err = deployment.CreateOrUpdateDeployment(cli, &kubeDeployment)
		if err != nil {
			publishHistory.Status = models.ReleaseFailure
			publishHistory.Message = err.Error()
			logs.Error("deploy deployment error.%v", err)
			c.HandleError(err)
			return
		} else {
			publishHistory.Status = models.ReleaseSuccess
			err = models.PublishStatusModel.Add(deploymentId, tplId, cluster, models.PublishTypeDeployment)
			// 添加发布状态
			if err != nil {
				logs.Error("add deployment deploy status error.%v", err)
				c.HandleError(err)
				return
			}

			err = models.DeploymentModel.Update(*kubeDeployment.Spec.Replicas, deploymentModel, cluster)
			if err != nil {
				logs.Error("update deployment metadata error.%v", err)
				c.HandleError(err)
				return
			}
		}
		webhook.PublishEventDeployment(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.UpgradeDeployment, response.Resource{
			Type:         publishHistory.Type,
			ResourceId:   publishHistory.ResourceId,
			ResourceName: publishHistory.ResourceName,
			TemplateId:   publishHistory.TemplateId,
			Cluster:      publishHistory.Cluster,
			Status:       publishHistory.Status,
			Message:      publishHistory.Message,
		})
		c.Success("ok")
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

func checkResourceAvailable(ns *models.Namespace, cli *kubernetes.Clientset, kubeDeployment *v1beta1.Deployment, cluster string) error {
	// this namespace can't use current cluster.
	clusterMetas, ok := ns.MetaDataObj.ClusterMetas[cluster]
	if !ok {
		return &base.ErrorResult{
			Code:    http.StatusForbidden,
			SubCode: http.StatusForbidden,
			Msg:     fmt.Sprintf("Current namespace (%s) can't use current cluster (%s).Please contact administrator. ", ns.Name, cluster),
		}

	}

	// check resources
	selector := labels.SelectorFromSet(map[string]string{
		util.NamespaceLabelKey: ns.Name,
	})
	namespaceResourceUsed, err := namespace.ResourcesUsageByNamespace(cli, ns.MetaDataObj.Namespace, selector.String())

	requestResourceList, err := deployment.GetDeploymentResource(cli, kubeDeployment)
	if err != nil {
		logs.Error("get deployment (%v) resource list error.%v", kubeDeployment, err)
		return err
	}

	if clusterMetas.ResourcesLimit.Memory != 0 &&
		clusterMetas.ResourcesLimit.Memory-(namespaceResourceUsed.Memory+requestResourceList.Memory)/1024 < 0 {
		return &base.ErrorResult{
			Code:    http.StatusForbidden,
			SubCode: base.ErrorSubCodeInsufficientResource,
			Msg:     fmt.Sprintf("request namespace resource (memory:%dGi) is not enough for this deploy", requestResourceList.Memory/1024),
		}
	}

	if clusterMetas.ResourcesLimit.Cpu != 0 &&
		clusterMetas.ResourcesLimit.Cpu-(namespaceResourceUsed.Cpu+requestResourceList.Cpu)/1000 < 0 {
		return &base.ErrorResult{
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

// @Title Get
// @Description find Deployment by cluster
// @Success 200 {object} models.Deployment success
// @router /:deployment/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeDeploymentController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":deployment")
	manager, err := client.Manager(cluster)
	if err == nil {
		result, err := deployment.GetDeploymentDetail(manager.Client, manager.Indexer, name, namespace)
		if err != nil {
			logs.Error("get kubernetes deployment detail error.", cluster, namespace, name, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Delete
// @Description delete the Deployment
// @Param	cluster		path 	string	true		"the cluster want to delete"
// @Param	namespace		path 	string	true		"the namespace want to delete"
// @Param	deployment		path 	string	true		"the deployment name want to delete"
// @Success 200 {string} delete success!
// @router /:deployment/namespaces/:namespace/clusters/:cluster [delete]
func (c *KubeDeploymentController) Offline() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":deployment")
	cli, err := client.Client(cluster)
	if err == nil {
		err := deployment.DeleteDeployment(cli, name, namespace)
		if err != nil {
			logs.Error("delete deployment (%s) by cluster (%s) error.%v", name, cluster, err)
			c.HandleError(err)
			return
		}
		webhook.PublishEventDeployment(c.NamespaceId, c.AppId, c.User.Name, c.Ctx.Input.IP(), webhook.DeleteDeployment, response.Resource{
			Type:         models.PublishTypeDeployment,
			ResourceName: name,
			Cluster:      cluster,
		})
		c.Success("ok!")
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}
