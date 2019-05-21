package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"],
		beego.ControllerComments{
			Method:           "GetDeploymentStatus",
			Router:           `/get_deployment_status`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"],
		beego.ControllerComments{
			Method:           "GetPodInfo",
			Router:           `/get_pod_info`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"],
		beego.ControllerComments{
			Method:           "GetPodInfoFromIP",
			Router:           `/get_pod_info_from_ip`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"],
		beego.ControllerComments{
			Method:           "GetPodList",
			Router:           `/get_pod_list`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"],
		beego.ControllerComments{
			Method:           "GetResourceInfo",
			Router:           `/get_resource_info`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"],
		beego.ControllerComments{
			Method:           "RestartDeployment",
			Router:           `/restart_deployment`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"],
		beego.ControllerComments{
			Method:           "ScaleDeployment",
			Router:           `/scale_deployment`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/openapi:OpenAPIController"],
		beego.ControllerComments{
			Method:           "UpgradeDeployment",
			Router:           `/upgrade_deployment`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

}
