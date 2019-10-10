package openapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"k8s.io/api/apps/v1beta1"
	v1 "k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/common"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	resdeployment "github.com/Qihoo360/wayne/src/backend/resources/deployment"
	"github.com/Qihoo360/wayne/src/backend/resources/pod"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type DeploymentInfo struct {
	Deployment         *models.Deployment
	DeploymentTemplete *models.DeploymentTemplate
	DeploymentObject   *v1beta1.Deployment
	Cluster            *models.Cluster
	Namespace          *models.Namespace
}

// swagger:parameters DeploymentStatusParam
type DeploymentStatusParam struct {
	// in: query
	// Required: true
	Deployment string `json:"deployment"`
	// Required: true
	Namespace string `json:"namespace"`
	// 和升级部署存在差别，不允许同时填写多个 cluster
	// Required: true
	Cluster string `json:"cluster"`
}

// swagger:parameters RestartDeploymentParam
type RestartDeploymentParam struct {
	// in: query
	// Required: true
	Deployment string `json:"deployment"`
	// Required: true
	Namespace string `json:"namespace"`
	// 和升级部署存在差别，不允许同时填写多个 cluster
	// Required: true
	Cluster string `json:"cluster"`
}

// swagger:parameters UpgradeDeploymentParam
type UpgradeDeploymentParam struct {
	// in: query
	// Required: true
	Deployment string `json:"deployment"`
	// Required: true
	Namespace string `json:"namespace"`
	// 支持同时填写多个 Cluster，只需要在 cluster 之间使用英文半角的逗号分隔即可
	// Required: true
	Cluster  string `json:"cluster"`
	clusters []string
	// Required: false
	TemplateId int `json:"template_id"`
	// 该字段为 true 的时候，会自动使用新生成的配置模板上线，否则会只创建对应的模板，并且将模板 ID 返回（用于敏感的需要手动操作的上线环境）
	// Required: false
	Publish bool `json:"publish"`
	// 升级的描述
	// Required: false
	Description string `json:"description"`
	// 该字段为扁平化为字符串的 key-value 字典，填写格式为 容器名1=镜像名1,容器名2=镜像名2 (即:多个容器之间使用英文半角的逗号分隔）
	// Required: false
	Images   string `json:"images"`
	imageMap map[string]string
	// 该字段为扁平化为字符串的 key-value 字典，填写格式为 环境变量1=值1,环境变量2=值2 (即:多个环境变量之间使用英文半角的逗号分隔）
	// Required: false
	Environments string `json:"environments"`
	envMap       map[string]string
}

// swagger:parameters ScaleDeploymentParam
type ScaleDeploymentParam struct {
	// in: query
	// Required: true
	Deployment string `json:"deployment"`
	// Required: true
	Namespace string `json:"namespace"`
	// 和升级部署存在差别，不允许同时填写多个 cluster
	// Required: true
	Cluster string `json:"cluster"`
	// 期望调度到的副本数量，范围：(0,32]
	// Required: true
	Replicas int `json:"replicas"`
}

// swagger:model deploymentstatus
type DeploymentStatus struct {
	// required: true
	Pods []response.Pod `json:"pods"`
	// required: true
	Deployment response.Deployment `json:"deployment"`
	// required: true
	Healthz bool `json:"healthz"`
}

// 重点关注 kubernetes 集群内状态而非描述信息，当然也可以只关注 healthz 字段
// swagger:response respdeploymentstatus
type respdeploymentstatus struct {
	// in: body
	// Required: true
	Body struct {
		response.ResponseBase
		DeploymentStatus DeploymentStatus `json:"status"`
	}
}

// swagger:parameters DeploymentStatusParam
type deploymentDetailParam struct {
	// in: query
	// Required: true
	Namespace string `json:"namespace"`
	// Required: true
	App string `json:"app"`
	// Required: true
	Deployment string `json:"deployment"`
}

// swagger:response deploymentDetail
type deploymentDetailResponse struct {
	// in: body
	// Required: true
	Body struct {
		response.ResponseBase
		Deployment *models.Deployment `json:"deployment"`
	}
}

// swagger:parameters LatestDeploymentTplParam
type latestDeploymentTplParam struct {
	// in: query
	// Required: true
	Namespace string `json:"namespace"`
	// Required: true
	App string `json:"app"`
	// Required: true
	Deployment string `json:"deployment"`
}

// swagger:response deploymentDetail
type latestDeploymentTplResponse struct {
	// in: body
	// Required: true
	Body struct {
		response.ResponseBase
		DeploymentTpl *models.DeploymentTemplate `json:"deployment_tpl"`
	}
}

// swagger:route GET /get_deployment_status deploy DeploymentStatusParam
//
// 该接口用于返回特定部署的状态信息
//
// 重点关注 kubernetes 集群内状态而非描述信息，当然也可以只关注 healthz 字段。
// 该接口可以使用所有种类的 apikey
//
//     Responses:
//       200: respdeploymentstatus
//       400: responseState
//       401: responseState
//       500: responseState
// @router /get_deployment_status [get]
func (c *OpenAPIController) GetDeploymentStatus() {
	param := DeploymentStatusParam{
		c.GetString("deployment"),
		c.GetString("namespace"),
		c.GetString("cluster"),
	}
	if !c.CheckoutRoutePermission(GetDeploymentStatusAction) {
		return
	}
	if !c.CheckDeploymentPermission(param.Deployment) {
		return
	}
	if !c.CheckNamespacePermission(param.Namespace) {
		return
	}

	var result respdeploymentstatus // 返回数据的结构体
	result.Body.Code = http.StatusOK
	ns, err := models.NamespaceModel.GetByName(param.Namespace)
	if err != nil {
		logs.Error("Failed get namespace by name", param.Namespace, err)
		c.AddErrorAndResponse(fmt.Sprintf("Failed get namespace by name(%s)", param.Namespace), http.StatusBadRequest)
		return
	}
	err = json.Unmarshal([]byte(ns.MetaData), &ns.MetaDataObj)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to parse metadata: %s", err.Error()))
		c.AddErrorAndResponse("", http.StatusInternalServerError)
		return
	}
	manager, err := client.Manager(param.Cluster)
	if err == nil {
		deployInfo, err := resdeployment.GetDeploymentDetail(manager.Client, manager.CacheFactory, param.Deployment, ns.KubeNamespace)
		if err != nil {
			logs.Error("Failed to get  k8s deployment state: %s", err.Error())
			c.AddErrorAndResponse("", http.StatusInternalServerError)
			return
		}
		result.Body.DeploymentStatus.Deployment = response.Deployment{
			Name:       deployInfo.ObjectMeta.Name,
			Namespace:  deployInfo.ObjectMeta.Namespace,
			Labels:     deployInfo.ObjectMeta.Labels,
			CreateTime: deployInfo.ObjectMeta.CreationTimestamp.Time,
			PodsState: response.PodInfo{
				Current:   deployInfo.Pods.Current,
				Desired:   deployInfo.Pods.Desired,
				Running:   deployInfo.Pods.Running,
				Pending:   deployInfo.Pods.Pending,
				Failed:    deployInfo.Pods.Failed,
				Succeeded: deployInfo.Pods.Succeeded,
			},
		}
		for _, e := range deployInfo.Pods.Warnings {
			result.Body.DeploymentStatus.Deployment.PodsState.Warnings = append(result.Body.DeploymentStatus.Deployment.PodsState.Warnings, fmt.Sprint(e))
		}
		podInfo, err := pod.GetPodsByDeployment(manager.CacheFactory, ns.KubeNamespace, param.Deployment)
		if err != nil {
			logs.Error("Failed to get k8s pod state: %s", err.Error())
			c.AddErrorAndResponse("", http.StatusInternalServerError)
			return
		}
		for _, pod := range podInfo {
			p := response.Pod{
				Name:      pod.Name,
				Namespace: pod.Namespace,
				State:     pod.State,
				PodIp:     pod.PodIp,
				NodeName:  pod.NodeName,
				StartTime: &pod.StartTime,
				Labels:    pod.Labels,
			}
			for _, status := range pod.ContainerStatus {
				p.ContainerStatus = append(p.ContainerStatus, response.ContainerStatus{status.Name, status.RestartCount})
			}
			result.Body.DeploymentStatus.Pods = append(result.Body.DeploymentStatus.Pods, p)
		}

		result.Body.DeploymentStatus.Healthz = true
		if deployInfo.Pods.Current != deployInfo.Pods.Desired {
			result.Body.DeploymentStatus.Healthz = false
		}

		for _, p := range podInfo {
			if p.PodIp == "" || p.State != string(v1.PodRunning) {
				result.Body.DeploymentStatus.Healthz = false
			}
		}
		c.HandleResponse(result.Body)
		return
	} else {
		logs.Error("Failed to get k8s client list", err)
		c.AddErrorAndResponse("Failed to get k8s client list!", http.StatusInternalServerError)
		return
	}
}

// swagger:route GET /restart_deployment deploy RestartDeploymentParam
//
// 用于用户调用以实现强制重启部署
//
// 该接口只能使用 app 级别的 apikey，这样做的目的主要是防止 apikey 的滥用
//
//     Responses:
//       200: responseSuccess
//       400: responseState
//       401: responseState
//       500: responseState
// @router /restart_deployment [get]
func (c *OpenAPIController) RestartDeployment() {
	param := RestartDeploymentParam{
		Deployment: c.GetString("deployment"),
		Namespace:  c.GetString("namespace"),
		Cluster:    c.GetString("cluster"),
	}
	if !c.CheckoutRoutePermission(RestartDeploymentAction) || !c.CheckDeploymentPermission(param.Deployment) || !c.CheckNamespacePermission(param.Namespace) {
		return
	}
	if len(param.Namespace) == 0 {
		c.AddErrorAndResponse(fmt.Sprintf("Invalid namespace parameter"), http.StatusBadRequest)
		return
	}
	if len(param.Deployment) == 0 {
		c.AddErrorAndResponse(fmt.Sprintf("Invalid deployment parameter"), http.StatusBadRequest)
		return
	}
	ns, err := models.NamespaceModel.GetByName(param.Namespace)
	if err != nil {
		c.AddErrorAndResponse(fmt.Sprintf("Failed get namespace by name(%s)", param.Namespace), http.StatusBadRequest)
		return
	}
	err = json.Unmarshal([]byte(ns.MetaData), &ns.MetaDataObj)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to parse metadata: %s", err.Error()))
		c.AddErrorAndResponse("", http.StatusInternalServerError)
		return
	}
	deployResource, err := models.DeploymentModel.GetByName(param.Deployment)
	if err != nil {
		c.AddErrorAndResponse(fmt.Sprintf("Failed get deployment by name(%s)", param.Deployment), http.StatusBadRequest)
		return
	}

	cli, err := client.Client(param.Cluster)
	if err != nil {
		logs.Error("Failed to connect to k8s client", err)
		c.AddErrorAndResponse(fmt.Sprintf("Failed to connect to k8s client on %s!", param.Cluster), http.StatusInternalServerError)
		return
	}

	deployObj, err := resdeployment.GetDeployment(cli, param.Deployment, ns.KubeNamespace)
	if err != nil {
		logs.Error("Failed to get deployment from k8s client", err.Error())
		c.AddErrorAndResponse(fmt.Sprintf("Failed to get deployment from k8s client on %s!", param.Cluster), http.StatusInternalServerError)
		return
	}
	deployObj.Spec.Template.ObjectMeta.Labels["timestamp"] = strconv.FormatInt(time.Now().Unix(), 10)

	if err := updateDeployment(deployObj, param.Cluster, c.APIKey.String(), "Restart Deployment", deployResource.Id); err != nil {
		logs.Error("Failed to restart from k8s client", err.Error())
		c.AddErrorAndResponse(fmt.Sprintf("Failed to restart from k8s client on %s!", param.Cluster), http.StatusInternalServerError)
		return
	}
	c.HandleResponse(nil)
}

// swagger:route GET /upgrade_deployment deploy UpgradeDeploymentParam
//
// 用于 CI/CD 中的集成升级部署
//
// 该接口只能使用 app 级别的 apikey，这样做的目的主要是防止 apikey 的滥用。
// 目前用户可以选择两种用法，第一种是默认的，会根据请求的 images 和 environments 对特定部署线上模板进行修改并创建新模板，然后使用新模板进行升级；
// 需要说明的是，environments 列表会对 deployment 内所有容器中包含指定环境变量 key 的环境变量进行更新，如不包含，则不更新。
// 第二种是通过指定 publish=false 来关掉直接上线，这种条件下会根据 images 和 environments 字段创建新的模板，并返回新模板id，用户可以选择去平台上手动上线或者通过本接口指定template_id参数上线。
// cluster 字段可以选择单个机房也可以选择多个机房，对于创建模板并上线的用法，会根据指定的机房之前的模板进行分类（如果机房 a 和机房 b 使用同一个模板，那么调用以后仍然共用一个新模板）
// 而对于指定 template_id 来上线的形式，则会忽略掉所有检查，直接使用特定模板上线到所有机房。
//
//     Responses:
//       200: responseSuccess
//       400: responseState
//       401: responseState
//       500: responseState
// @router /upgrade_deployment [get]
func (c *OpenAPIController) UpgradeDeployment() {
	param := UpgradeDeploymentParam{
		Deployment:   c.GetString("deployment"),
		Namespace:    c.GetString("namespace"),
		Cluster:      c.GetString("cluster"),
		Description:  c.GetString("description"),
		Images:       c.GetString("images"),
		Environments: c.GetString("environments"),
	}
	if !c.CheckoutRoutePermission(UpgradeDeploymentAction) || !c.CheckDeploymentPermission(param.Deployment) || !c.CheckNamespacePermission(param.Namespace) {
		return
	}
	param.clusters = strings.Split(param.Cluster, ",")
	var err error
	param.Publish, err = c.GetBool("publish", true)
	if err != nil {
		c.AddErrorAndResponse(fmt.Sprintf("Invalid publish parameter: %s", err.Error()), http.StatusBadRequest)
		return
	}
	param.TemplateId, err = c.GetInt("template_id", 0)
	if err != nil {
		c.AddErrorAndResponse(fmt.Sprintf("Invalid template_id parameter: %s", err.Error()), http.StatusBadRequest)
		return
	}

	// 根据特定模板升级，无须拼凑
	if param.TemplateId != 0 && param.Publish {
		for _, cluster := range param.clusters {
			deployInfo, err := getOnlineDeploymenetInfo(param.Deployment, param.Namespace, cluster, int64(param.TemplateId))
			if err != nil {
				logs.Error("Failed to get online deployment", err)
				c.AddError(fmt.Sprintf("Failed to get online deployment on %s!", cluster))
				continue
			}
			common.DeploymentPreDeploy(deployInfo.DeploymentObject, deployInfo.Deployment, deployInfo.Cluster, deployInfo.Namespace)
			err = publishDeployment(deployInfo, c.APIKey.String())
			if err != nil {
				logs.Error("Failed to publish deployment", err)
				c.AddError(fmt.Sprintf("Failed to publish deployment on %s!", cluster))
			}
		}
		c.HandleResponse(nil)
		return
	}

	// 拼凑 images 升级
	param.imageMap = make(map[string]string)
	imageArr := strings.Split(param.Images, ",")
	// param.imageMap = make(map[string]string)
	for _, image := range imageArr {
		arr := strings.Split(image, "=")
		if len(arr) == 2 && arr[1] != "" {
			param.imageMap[arr[0]] = arr[1]
		}
	}
	// 拼凑环境变量
	param.envMap = make(map[string]string)
	envArr := strings.Split(param.Environments, ",")
	// param.envMap = make(map[string]string)
	for _, env := range envArr {
		arr := strings.Split(env, "=")
		if len(arr) == 2 && arr[1] != "" {
			param.envMap[arr[0]] = arr[1]
		}
	}

	if len(param.imageMap) == 0 && len(param.envMap) == 0 {
		c.AddErrorAndResponse(fmt.Sprintf("Invalid images/environments parameter: %s %s", param.Images, param.Environments), http.StatusBadRequest)
		return
	}

	deployInfoMap := make(map[int64]([]*DeploymentInfo))
	for _, cluster := range param.clusters {
		deployInfo, err := getOnlineDeploymenetInfo(param.Deployment, param.Namespace, cluster, 0)
		if err != nil {
			c.AddError(fmt.Sprintf("Failed to get online deployment info on %s", cluster))
			continue
		}

		// 率先把强制指定的环境变量，如和系统环境变量冲突，后面会覆盖
		for k, v := range deployInfo.DeploymentObject.Spec.Template.Spec.Containers {
			for i, e := range v.Env {
				if param.envMap[e.Name] != "" {
					deployInfo.DeploymentObject.Spec.Template.Spec.Containers[k].Env[i].Value = param.envMap[e.Name]
				}
			}
		}

		common.DeploymentPreDeploy(deployInfo.DeploymentObject, deployInfo.Deployment, deployInfo.Cluster, deployInfo.Namespace)
		tmplId := deployInfo.DeploymentTemplete.Id
		deployInfo.DeploymentTemplete.Id = 0
		deployInfo.DeploymentTemplete.User = c.APIKey.String()
		deployInfo.DeploymentTemplete.Description = "[APIKey] " + c.GetString("description")
		// 更新镜像版本
		ci := make(map[string]string)
		for k, v := range param.imageMap {
			ci[k] = v
		}
		for k, v := range deployInfo.DeploymentObject.Spec.Template.Spec.Containers {
			if param.imageMap[v.Name] != "" {
				deployInfo.DeploymentObject.Spec.Template.Spec.Containers[k].Image = param.imageMap[v.Name]
				delete(ci, v.Name)
			}
		}
		if len(ci) > 0 {
			var keys []string
			for k := range ci {
				keys = append(keys, k)
			}
			c.AddError(fmt.Sprintf("Deployment template don't have container: %s", strings.Join(keys, ",")))
			continue
		}
		deployInfoMap[tmplId] = append(deployInfoMap[tmplId], deployInfo)
	}

	if len(c.Failure.Body.Errors) > 0 {
		c.HandleResponse(nil)
		return
	}

	for id, deployInfos := range deployInfoMap {
		deployInfo := deployInfos[0]
		newTpl, err := json.Marshal(deployInfo.DeploymentObject)
		if err != nil {
			logs.Error("Failed to parse metadata: %s", err)
			c.AddError(fmt.Sprintf("Failed to parse metadata!"))
			continue
		}
		deployInfo.DeploymentTemplete.Template = string(newTpl)
		//更新deploymentTpl中的CreateTime和UpdateTime,数据库中不会自动更新
		deployInfo.DeploymentTemplete.CreateTime = time.Now()
		deployInfo.DeploymentTemplete.UpdateTime = time.Now()
		newtmplId, err := models.DeploymentTplModel.Add(deployInfo.DeploymentTemplete)
		if err != nil {
			logs.Error("Failed to save new deployment template", err)
			c.AddError(fmt.Sprintf("Failed to save new deployment template!"))
			continue
		}

		for k, deployInfo := range deployInfos {
			err := models.DeploymentModel.UpdateById(deployInfo.Deployment)
			if err != nil {
				logs.Error("Failed to update deployment by id", err)
				c.AddError(fmt.Sprintf("Failed to update deployment by id!"))
				continue
			}
			deployInfoMap[id][k].DeploymentTemplete.Id = newtmplId
		}
	}

	if !param.Publish || len(c.Failure.Body.Errors) > 0 {
		c.HandleResponse(nil)
		return
	}

	for _, deployInfos := range deployInfoMap {
		for _, deployInfo := range deployInfos {
			err := publishDeployment(deployInfo, c.APIKey.String())
			if err != nil {
				logs.Error("Failed to publish deployment", err)
				c.AddError(fmt.Sprintf("Failed to publish deployment on %s!", deployInfo.Cluster.Name))
			}
		}
	}
	c.HandleResponse(nil)
}

// swagger:route GET /scale_deployment deploy ScaleDeploymentParam
//
// 用于 CI/CD 中的部署水平扩容/缩容
//
// 副本数量范围为0-32
// 该接口只能使用 app 级别的 apikey，这样做的目的主要是防止 apikey 的滥用
//
//     Responses:
//       200: responseSuccess
//       400: responseState
//       401: responseState
//       500: responseState
// @router /scale_deployment [get]
func (c *OpenAPIController) ScaleDeployment() {
	param := ScaleDeploymentParam{
		Deployment: c.GetString("deployment"),
		Namespace:  c.GetString("namespace"),
		Cluster:    c.GetString("cluster"),
	}
	if !c.CheckoutRoutePermission(ScaleDeploymentAction) || !c.CheckDeploymentPermission(param.Deployment) || !c.CheckNamespacePermission(param.Namespace) {
		return
	}
	var err error
	param.Replicas, err = c.GetInt("replicas", 0)
	if err != nil {
		c.AddErrorAndResponse(fmt.Sprintf("Invalid replicas parameter: %s", err.Error()), http.StatusBadRequest)
		return
	}
	if param.Replicas > 32 || param.Replicas <= 0 {
		c.AddErrorAndResponse(fmt.Sprintf("Invalid replicas parameter: %d not in range (0,32]", param.Replicas), http.StatusBadRequest)
		return
	}
	if len(param.Namespace) == 0 {
		c.AddErrorAndResponse(fmt.Sprintf("Invalid namespace parameter"), http.StatusBadRequest)
		return
	}
	if len(param.Deployment) == 0 {
		c.AddErrorAndResponse(fmt.Sprintf("Invalid deployment parameter"), http.StatusBadRequest)
		return
	}

	ns, err := models.NamespaceModel.GetByName(param.Namespace)
	if err != nil {
		c.AddErrorAndResponse(fmt.Sprintf("Failed get namespace by name(%s)", param.Namespace), http.StatusBadRequest)
		return
	}
	err = json.Unmarshal([]byte(ns.MetaData), &ns.MetaDataObj)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to parse metadata: %s", err.Error()))
		c.AddErrorAndResponse("", http.StatusInternalServerError)
		return
	}
	deployResource, err := models.DeploymentModel.GetByName(param.Deployment)
	if err != nil {
		c.AddErrorAndResponse(fmt.Sprintf("Failed get deployment by name(%s)", param.Deployment), http.StatusBadRequest)
		return
	}
	err = json.Unmarshal([]byte(deployResource.MetaData), &deployResource.MetaDataObj)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to parse metadata: %s", err.Error()))
		c.AddErrorAndResponse("", http.StatusInternalServerError)
		return
	}

	cli, err := client.Client(param.Cluster)
	if err != nil {
		logs.Error("Failed to connect to k8s client", err)
		c.AddErrorAndResponse(fmt.Sprintf("Failed to connect to k8s client on %s!", param.Cluster), http.StatusInternalServerError)
		return
	}

	deployObj, err := resdeployment.GetDeployment(cli, param.Deployment, ns.KubeNamespace)
	if err != nil {
		logs.Error("Failed to get deployment from k8s client", err.Error())
		c.AddErrorAndResponse(fmt.Sprintf("Failed to get deployment from k8s client on %s!", param.Cluster), http.StatusInternalServerError)
		return
	}
	replicas32 := int32(param.Replicas)
	deployObj.Spec.Replicas = &replicas32
	if err := updateDeployment(deployObj, param.Cluster, c.APIKey.String(), "Scale Deployment", deployResource.Id); err != nil {
		logs.Error("Failed to upgrade from k8s client", err.Error())
		c.AddErrorAndResponse(fmt.Sprintf("Failed to upgrade from k8s client on %s!", param.Cluster), http.StatusInternalServerError)
		return
	}
	err = models.DeploymentModel.Update(replicas32, deployResource, param.Cluster)
	if err != nil {
		// 非敏感错误，无须暴露给用户
		logs.Error("Failed to update deployment in db!", err.Error())
	}
	c.HandleResponse(nil)
}

// 主要用于从数据库中查找、拼凑出用于更新的模板资源，资源主要用于 k8s 数据更新和 数据库存储更新记录等
func getOnlineDeploymenetInfo(deployment, namespace, cluster string, templateId int64) (deployInfo *DeploymentInfo, err error) {
	if len(deployment) == 0 {
		return nil, fmt.Errorf("Invalid deployment parameter!")
	}
	if len(namespace) == 0 {
		return nil, fmt.Errorf("Invalid namespace parameter!")
	}
	if len(cluster) == 0 {
		return nil, fmt.Errorf("Invalid cluster parameter!")
	}
	deployResource, err := models.DeploymentModel.GetByName(deployment)
	if err != nil {
		return nil, fmt.Errorf("Failed to get deployment by name(%s)!", deployment)
	}

	deployInfo = new(DeploymentInfo)

	// 根据特定模板升级
	if templateId != 0 {
		deployInfo.DeploymentTemplete, err = models.DeploymentTplModel.GetById(int64(templateId))
		if err != nil {
			return nil, fmt.Errorf("Failed to get deployment template by id: %s", err.Error())
		}
		if deployResource.Id != deployInfo.DeploymentTemplete.DeploymentId {
			return nil, fmt.Errorf("Invalid template id parameter(no permission)!")
		}
	} else {
		// 获取并更新线上模板
		status, err := models.PublishStatusModel.GetByCluster(models.PublishTypeDeployment, deployResource.Id, cluster)
		if err != nil {
			return nil, fmt.Errorf("Failed to get publish status by cluster: %s", err.Error())
		}
		onlineTplId := status.TemplateId

		deployInfo.DeploymentTemplete, err = models.DeploymentTplModel.GetById(onlineTplId)
		if err != nil {
			return nil, fmt.Errorf("Failed to get deployment template by id: %s", err.Error())
		}
	}

	deployObj := v1beta1.Deployment{}
	err = json.Unmarshal(hack.Slice(deployInfo.DeploymentTemplete.Template), &deployObj)
	if err != nil {
		return nil, fmt.Errorf("Failed to parse deployment template: %s", err.Error())
	}
	// 拼凑 namespace 参数
	app, _ := models.AppModel.GetById(deployResource.AppId)
	err = json.Unmarshal([]byte(app.Namespace.MetaData), &app.Namespace.MetaDataObj)
	if err != nil {
		return nil, fmt.Errorf("Failed to parse namespace metadata: %s", err.Error())
	}
	if namespace != app.Namespace.Name {
		return nil, fmt.Errorf("Invalid namespace parameter(should be the namespace of the application)")
	}
	deployObj.Namespace = app.Namespace.KubeNamespace

	// 拼凑副本数量参数
	err = json.Unmarshal([]byte(deployResource.MetaData), &deployResource.MetaDataObj)
	if err != nil {
		return nil, fmt.Errorf("Failed to parse deployment resource metadata: %s", err.Error())
	}
	rp := deployResource.MetaDataObj.Replicas[cluster]
	deployObj.Spec.Replicas = &rp
	deployInfo.DeploymentObject = &deployObj
	deployInfo.Deployment = deployResource

	deployInfo.Namespace = app.Namespace

	deployInfo.Cluster, err = models.ClusterModel.GetParsedMetaDataByName(cluster)
	if err != nil {
		return nil, fmt.Errorf("Failed to get cluster by name: %s", err.Error())
	}
	return deployInfo, nil
}

// 通过给定模板资源把业务发布到k8s集群中，并在数据库中更新发布记录
func publishDeployment(deployInfo *DeploymentInfo, username string) error {
	// 操作 kubernetes api，实现升级部署
	cli, err := client.Client(deployInfo.Cluster.Name)
	if err == nil {
		publishHistory := &models.PublishHistory{
			Type:         models.PublishTypeDeployment,
			ResourceId:   deployInfo.Deployment.Id,
			ResourceName: deployInfo.DeploymentObject.Name,
			TemplateId:   deployInfo.DeploymentTemplete.Id,
			Cluster:      deployInfo.Cluster.Name,
			User:         username,
			Message:      deployInfo.DeploymentTemplete.Description,
		}
		defer models.PublishHistoryModel.Add(publishHistory)
		_, err = resdeployment.CreateOrUpdateDeployment(cli, deployInfo.DeploymentObject)
		if err != nil {
			publishHistory.Status = models.ReleaseFailure
			publishHistory.Message = err.Error()
			return fmt.Errorf("Failed to create or update deployment by k8s client: %s", err.Error())
		} else {
			publishHistory.Status = models.ReleaseSuccess
			err := models.PublishStatusModel.Add(deployInfo.Deployment.Id, deployInfo.DeploymentTemplete.Id, deployInfo.Cluster.Name, models.PublishTypeDeployment)
			if err != nil {
				return err
			}
			return nil
		}
	} else {
		return fmt.Errorf("Failed to get k8s client(cluster: %s): %v", deployInfo.Cluster.Name, err)
	}
}

func updateDeployment(deployObj *v1beta1.Deployment, cluster string, name string, msg string, resourceId int64) error {
	status, err := models.PublishStatusModel.GetByCluster(models.PublishTypeDeployment, resourceId, cluster)
	if err != nil {
		return fmt.Errorf("Failed to get publish status by cluster: %s", err.Error())
	}
	publishHistory := &models.PublishHistory{
		Type:         models.PublishTypeDeployment,
		ResourceId:   resourceId,
		ResourceName: deployObj.Name,
		TemplateId:   status.TemplateId,
		Cluster:      cluster,
		User:         name,
		Message:      msg,
	}
	defer models.PublishHistoryModel.Add(publishHistory)
	cli, err := client.Client(cluster)
	if err != nil {
		return err
	}
	_, err = resdeployment.UpdateDeployment(cli, deployObj)
	if err != nil {
		publishHistory.Status = models.ReleaseFailure
		publishHistory.Message = err.Error()
		return fmt.Errorf("Failed to update deployment by k8s client: %s", err.Error())
	} else {
		publishHistory.Status = models.ReleaseSuccess
		err := models.PublishStatusModel.Add(resourceId, status.TemplateId, cluster, models.PublishTypeDeployment)
		if err != nil {
			return err
		}
		return nil
	}
}

// swagger:route GET /get_deployment_detail deploy DeploymentDetailParam
//
// 通过给定的namespace、app name、deployment name来查询某个具体deployment的信息
//
// 因为查询范围是对所有的服务进行的，因此需要绑定 全局 apikey 使用。
//
//     Responses:
//       200: respresourceinfo
//       400: responseState
//       500: responseState
// @router /get_deployment_detail [get]
func (c *OpenAPIController) GetDeploymentDetail() {
	if !c.CheckoutRoutePermission(GetDeploymentDetailAction) {
		return
	}
	if c.APIKey.Type != models.GlobalAPIKey {
		c.AddErrorAndResponse("You can only use global APIKey in this action!", http.StatusUnauthorized)
		return
	}
	ns := c.GetString("namespace")
	app := c.GetString("app")
	deployment := c.GetString("deployment")
	if len(ns) == 0 {
		c.AddErrorAndResponse("Invalid namespace parameter!", http.StatusBadRequest)
		return
	}
	if len(app) == 0 {
		c.AddErrorAndResponse("Invalid app parameter!", http.StatusBadRequest)
		return
	}
	if len(deployment) == 0 {
		c.AddErrorAndResponse("Invalid deployment parameter!", http.StatusBadRequest)
		return
	}
	params := deploymentDetailParam{ns, app, deployment}
	dep, err := models.DeploymentModel.GetUniqueDepByName(params.Namespace, params.App, params.Deployment)
	if err != nil {
		c.AddErrorAndResponse("Failed to get deployment by name!", http.StatusBadRequest)
		return
	}
	resp := new(deploymentDetailResponse)
	resp.Body.Deployment = dep
	resp.Body.Code = http.StatusOK
	c.HandleResponse(resp.Body)
}

// swagger:route GET /get_latest_deployment_tpl deploy LatestDeploymentTplParam
//
// 通过给定的namespace、app name、deployment name来查询某个具体deployment的最新部署模板信息
//
// 因为查询范围是对所有的服务进行的，因此需要绑定 全局 apikey 使用。
//
//     Responses:
//       200: respresourceinfo
//       400: responseState
//       500: responseState
// @router /get_latest_deployment_tpl [get]
func (c *OpenAPIController) GetLatestDeploymentTpl() {
	if !c.CheckoutRoutePermission(GetLatestDeploymentTplAction) {
		return
	}
	if c.APIKey.Type != models.GlobalAPIKey {
		c.AddErrorAndResponse("You can only use global APIKey in this action!", http.StatusUnauthorized)
		return
	}
	ns := c.GetString("namespace")
	app := c.GetString("app")
	deployment := c.GetString("deployment")
	if len(ns) == 0 {
		c.AddErrorAndResponse("Invalid namespace parameter!", http.StatusBadRequest)
		return
	}
	if len(app) == 0 {
		c.AddErrorAndResponse("Invalid app parameter!", http.StatusBadRequest)
		return
	}
	if len(deployment) == 0 {
		c.AddErrorAndResponse("Invalid deployment parameter!", http.StatusBadRequest)
		return
	}
	params := latestDeploymentTplParam{ns, app, deployment}
	dep, err := models.DeploymentTplModel.GetLatestDeptplByName(params.Namespace, params.App, params.Deployment)
	if err != nil {
		c.AddErrorAndResponse("Failed to get deployment by name!", http.StatusBadRequest)
		return
	}
	resp := new(latestDeploymentTplResponse)
	resp.Body.DeploymentTpl = dep
	resp.Body.Code = http.StatusOK
	c.HandleResponse(resp.Body)
}
