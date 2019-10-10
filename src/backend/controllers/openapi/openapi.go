// Package openapi Wayne OpenAPI Document
//
// wayne 开放 API （以下简称 openapi）是一组便于开发者调试、第三方工具开发和 CI/CD 的开放数据接口。
// openapi 虽然格式上满足 Restful，但是并不是单一接口只针对特定资源的操作，在大部分时候单一接口会操作一组资源；
// 同时，虽然 openapi 下只允许通过 GET 请求访问，但是并不意味着 GET 操作代表着 Restful 中对 GET 的用法定义；
// openapi 的路径格式：/openapi/v1/gateway/action/:action，:action 代表特定操作，例如： get_vip_info、upgrade_deployment。
//
// openapi 所操作的 action 必须搭配具有该 action 权限的 APIKey 使用（作为一个命名为 apikey 的 GET 请求参数），
// 而对应的 apikey 需要具备 action 对应的权限（例如：action 对应 get_pod_info 的时候，apikey 需要具备 OPENAPI_GET_POD_INFO 权限），
// 同时，受限于某些action的使用场景，可能强制要求附加的 APIKey 的使用范围，目前APIKey的适用范围包括三种，App 级别、Namespace 级别 以及 全局级别。
// Terms Of Service:
//
//
//     Schemes: https
//     Host: localhost
//     BasePath: /openapi/v1/gateway/action
//     Version: 1.6.1
//
//     Consumes:
//     - application/json
//
//     Produces:
//     - application/json
//
//     Security:
//     - api_key:
//
//     SecurityDefinitions:
//     api_key:
//          type: apiKey
//          name: apikey
//          in: query
//
// swagger:meta
package openapi

import (
	"fmt"
	"net/http"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

const (
	GetPodInfoAction             = "GET_POD_INFO"
	GetPodInfoFromIPAction       = "GET_POD_INFO_FROM_IP"
	GetResourceInfoAction        = "GET_RESOURCE_INFO"
	GetDeploymentStatusAction    = "GET_DEPLOYMENT_STATUS"
	UpgradeDeploymentAction      = "UPGRADE_DEPLOYMENT"
	ScaleDeploymentAction        = "SCALE_DEPLOYMENT"
	RestartDeploymentAction      = "RESTART_DEPLOYMENT"
	GetDeploymentDetailAction    = "GET_DEPLOYMENT_DETAIL"
	GetLatestDeploymentTplAction = "GET_LATEST_DEPLOYMENT_TPL"
	GetPodListAction             = "GET_POD_LIST"

	ListNamespaceUsers = "LIST_NAMESPACE_USERS"
	ListNamespaceApps  = "LIST_NAMESPACE_APPS"
	ListAppDeploys     = "List_APP_DEPLOYS"

	PermissionPrefix = "OPENAPI_"
)

type OpenAPIController struct {
	base.APIKeyController
}

func (c *OpenAPIController) Prepare() {
	c.APIKeyController.Prepare()
}

func (c *OpenAPIController) CheckoutRoutePermission(action string) bool {
	permission := false
	for _, p := range c.APIKey.Group.Permissions {
		if p.Name == PermissionPrefix+action {
			permission = true
		}
	}
	if !permission {
		c.AddErrorAndResponse(fmt.Sprintf("APIKey does not have the following permission: %s", PermissionPrefix+action), http.StatusUnauthorized)
		return false
	}
	return true
}

func (c *OpenAPIController) CheckDeploymentPermission(deployment string) bool {
	if c.APIKey.Type == models.NamespaceAPIKey {
		d, err := models.DeploymentModel.GetByName(deployment)
		if err != nil {
			logs.Error("Failed to get deployment by name", err)
			c.AddErrorAndResponse("", http.StatusBadRequest)
			return false
		}
		app, _ := models.AppModel.GetById(d.AppId)
		if app.Namespace.Id != c.APIKey.ResourceId {
			c.AddErrorAndResponse(fmt.Sprintf("APIKey does not have permission to operate request resource: %s", deployment), http.StatusUnauthorized)
			return false
		}
	}
	if c.APIKey.Type == models.ApplicationAPIKey {
		deploy, err := models.DeploymentModel.GetByName(deployment)
		if err != nil {
			logs.Error("Failed to get deployment by name", err)
			c.AddErrorAndResponse("", http.StatusBadRequest)
			return false
		}
		if deploy.AppId != c.APIKey.ResourceId {
			c.AddErrorAndResponse(fmt.Sprintf("APIKey does not have permission to operate request resource(deployment): %s", deployment), http.StatusUnauthorized)
			return false
		}
	}
	return true
}

func (c *OpenAPIController) CheckNamespacePermission(namespace string) bool {
	if c.APIKey.Type == models.NamespaceAPIKey {
		ns, err := models.NamespaceModel.GetByName(namespace)
		if err != nil {
			logs.Error("Failed to get namespace by name", err)
			c.AddErrorAndResponse("", http.StatusBadRequest)
			return false
		}
		if ns.Deleted == true {
			c.AddErrorAndResponse(fmt.Sprintf("The requested namespace has been offline: %s", namespace), http.StatusBadRequest)
			return false
		}
		if ns.Id != c.APIKey.ResourceId {
			c.AddErrorAndResponse(fmt.Sprintf("APIKey does not have permission to operate request resource(namespace): %s", namespace), http.StatusUnauthorized)
			return false
		}
	}
	return true
}
