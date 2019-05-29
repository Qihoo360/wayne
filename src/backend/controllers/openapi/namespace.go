package openapi

import (
	"net/http"

	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
)

// resource info include app info and users info.
// swagger:response respresourceinfos
type respResourceInfos struct {
	// in: body
	// Required: true
	Body struct {
		response.ResponseBase
		Resources []resourceInfo `json:"resources"`
	}
}

// swagger:route GET /list_namespace_users resource ResourceInfoParam
//
// 通过给定的namespace，获取 用户信息
//
// 因为查询范围是指定namespace，因此需要绑定 namespace apikey 使用。
//
//     Responses:
//       200: respresourceinfo
//       400: responseState
//       500: responseState
// @router /list_namespace_users [get]
func (c *OpenAPIController) ListNamespaceUsers() {
	if !c.CheckoutRoutePermission(ListNamespaceUsers) {
		return
	}
	ns := c.GetString("namespace")
	if ns == "" {
		c.AddErrorAndResponse("Invalid namespace parameter!", http.StatusBadRequest)
		return
	}

	namespace, err := models.NamespaceModel.GetByNameAndDeleted(ns, false)
	if err != nil {
		c.AddErrorAndResponse("No namespace exists!", http.StatusBadRequest)
		return
	}
	users, err := models.NamespaceUserModel.GetUserListByNamespaceId(namespace.Id)
	if err != nil {
		c.AddErrorAndResponse("Failed to get user list by namespace id!", http.StatusBadRequest)
		return
	}

	resp := new(respResourceInfo)
	resp.Body.Resource.Users = make(map[string]*response.User)

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

// swagger:route GET /list_namespace_apps resource ResourceInfoParam
//
// 通过给定的namespace，获取 app 信息和用户信息
//
// 因为查询范围是指定namespace，因此需要绑定 namespace apikey 使用。
//
//     Responses:
//       200: respresourceinfo
//       400: responseState
//       500: responseState
// @router /list_namespace_apps [get]
func (c *OpenAPIController) ListNamespaceApps() {
	if !c.CheckoutRoutePermission(ListNamespaceApps) {
		return
	}
	ns := c.GetString("namespace")
	if ns == "" {
		c.AddErrorAndResponse("Invalid namespace parameter!", http.StatusBadRequest)
		return
	}

	namespace, err := models.NamespaceModel.GetByNameAndDeleted(ns, false)
	if err != nil {
		c.AddErrorAndResponse("No namespace exists!", http.StatusBadRequest)
		return
	}
	apps, err := models.AppModel.GetAppsByNamespaceId(namespace.Id, false)
	if err != nil {
		c.AddErrorAndResponse("Failed to get apps by namespace id!", http.StatusBadRequest)
		return
	}

	resp := new(respResourceInfos)
	for _, app := range apps {
		users := make(map[string]*response.User)

		appUsers, err := models.AppUserModel.GetUserListByAppId(app.Id)
		if err != nil {
			c.AddErrorAndResponse("Failed to get appUser list by app id!", http.StatusBadRequest)
			return
		}

		for _, usr := range appUsers {
			if users[usr.User.Name] == nil {
				u := response.User{
					Name:    usr.User.Name,
					Email:   usr.User.Email,
					Display: usr.User.Display,
					Roles:   []string{usr.Group.Name},
				}
				users[usr.User.Name] = &u
			} else {
				users[usr.User.Name].Roles = append(users[usr.User.Name].Roles, usr.Group.Name)
			}
		}

		resp.Body.Resources = append(resp.Body.Resources, resourceInfo{
			App: response.App{
				app.Id, app.Name, app.Namespace.Name, app.Description, app.User, app.Deleted, app.CreateTime, app.UpdateTime,
			},
			Users: users,
		})
	}

	resp.Body.Code = http.StatusOK
	c.HandleResponse(resp.Body)
}
