package openapi

import (
	"net/http"
	"strings"

	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type resourceInfo struct {
	// required: true
	App response.App `json:"app"`
	// required: true
	Users map[string]*response.User `json:"users"`
}

// resource info include app info and users info.
// swagger:response respresourceinfo
type respResourceInfo struct {
	// in: body
	// Required: true
	Body struct {
		response.ResponseBase
		Resource resourceInfo `json:"resource"`
	}
}

// swagger:parameters ResourceInfoParam
type getResourceInfoParam struct {
	// in: query
	// 资源类型，支持 Deployment,CronJob,StatefulSet,DaemonSet 等
	// Required: true
	ResourceType models.KubeApiType `json:"type"`
	// Required: true
	Name string `json:"name"`
}

// swagger:route GET /get_resource_info resource ResourceInfoParam
//
// 通过给定的资源类型和资源名称反查出资源所属的 app 和 用户信息
//
// 因为查询范围是对所有的服务进行的，因此需要绑定 全局 apikey 使用。
//
//     Responses:
//       200: respresourceinfo
//       400: responseState
//       500: responseState
// @router /get_resource_info [get]
func (c *OpenAPIController) GetResourceInfo() {
	if !c.CheckoutRoutePermission(GetResourceInfoAction) {
		return
	}
	if c.APIKey.Type != models.GlobalAPIKey {
		c.AddErrorAndResponse("You can only use global APIKey in this action!", http.StatusUnauthorized)
		return
	}
	t := c.GetString("type")
	if len(t) == 0 {
		c.AddErrorAndResponse("Invalid type parameter!", http.StatusBadRequest)
		return
	}
	params := getResourceInfoParam{models.KubeApiType(strings.ToUpper(t[0:1]) + strings.ToLower(t[1:])), c.GetString("name")}
	var err error
	var appId int64
	filter := make(map[string]interface{})
	filter["name"] = params.Name
	var tableName string
	switch params.ResourceType {
	case models.KubeApiTypeDeployment:
		tableName = models.TableNameDeployment
	case models.KubeApiTypeCronJob:
		tableName = models.TableNameCronjob
	case models.KubeApiTypeStatefulSet:
		tableName = models.TableNameStatefulset
	case models.KubeApiTypeDaemonSet:
		tableName = models.TableNameDaemonSet
	default:
		c.AddErrorAndResponse("Invalid type parameter!", http.StatusBadRequest)
		return
	}
	err, appId = models.GetAppIdByFilter(tableName, filter)
	if err != nil {
		c.AddErrorAndResponse("Failed to get App Info!", http.StatusInternalServerError)
		return
	}

	resp := new(respResourceInfo)
	resp.Body.Resource.Users = make(map[string]*response.User)
	app, err := models.AppModel.GetById(appId)
	if err != nil {
		c.AddErrorAndResponse("Failed to get App Info!", http.StatusInternalServerError)
		return
	}
	resp.Body.Resource.App = response.App{
		app.Id, app.Name, app.Namespace.Name, app.Description, app.User, app.Deleted, app.CreateTime, app.UpdateTime,
	}
	users, err := models.AppUserModel.GetUserListByAppId(appId)
	if err != nil {
		logs.Error("Failed to get app user list by app id", err)
		c.AddErrorAndResponse("", http.StatusInternalServerError)
		return
	}

	for _, usr := range users {
		if resp.Body.Resource.Users[usr.User.Name] == nil {
			u := response.User{
				Name:    usr.User.Name,
				Email:   usr.User.Email,
				Display: usr.User.Display,
				Roles:   []string{usr.Group.Name},
			}
			resp.Body.Resource.Users[usr.User.Name] = &u
		} else {
			resp.Body.Resource.Users[usr.User.Name].Roles = append(resp.Body.Resource.Users[usr.User.Name].Roles, usr.Group.Name)
		}
	}
	resp.Body.Code = http.StatusOK
	c.HandleResponse(resp.Body)
}
