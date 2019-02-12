package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"],
		beego.ControllerComments{
			Method:           "GetNames",
			Router:           `/names`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPAController"],
		beego.ControllerComments{
			Method:           "UpdateOrders",
			Router:           `/updateorders`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPATplController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPATplController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPATplController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPATplController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPATplController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPATplController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPATplController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPATplController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPATplController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/hpa:HPATplController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

}
