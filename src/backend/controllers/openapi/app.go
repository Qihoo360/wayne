package openapi

import (
	"net/http"

	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
)

// resource info include deploys.
// swagger:response deploys
type appResponse struct {
	// in: body
	// Required: true
	Body struct {
		response.ResponseBase
		Deploys []models.Deployment `json:"deploys"`
	}
}

// swagger:route GET /get_app_deploys resource ResourceInfoParam
//
// 通过给定的app，查询deploy信息
//
// 因为查询范围是对所有的服务进行的，因此需要绑定 全局 apikey 使用。
//
//     Responses:
//       200: respresourceinfo
//       400: responseState
//       500: responseState
// @router /get_app_deploys [get]
func (c *OpenAPIController) ListAppDeploys() {
	if !c.CheckoutRoutePermission(ListAppDeploys) {
		return
	}
	appName := c.GetString("app")
	if appName == "" {
		c.AddErrorAndResponse("Invalid app parameter!", http.StatusBadRequest)
		return
	}

	app, err := models.AppModel.GetByNameAndDeleted(appName, false)
	if err != nil {
		c.AddErrorAndResponse("No namespace exists!", http.StatusBadRequest)
		return
	}

	deploys, err := models.DeploymentModel.GetNames(map[string]interface{}{
		"App__Id": app.Id,
		"Deleted": false,
	})
	if err != nil {
		c.AddErrorAndResponse("Failed to get deploy list by filter!", http.StatusBadRequest)
		return
	}

	resp := new(appResponse)
	for _, deploy := range deploys {
		resp.Body.Deploys = append(resp.Body.Deploys, deploy)
	}

	resp.Body.Code = http.StatusOK
	c.HandleResponse(resp.Body)
}
