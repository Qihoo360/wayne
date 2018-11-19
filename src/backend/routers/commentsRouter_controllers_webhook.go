package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/webhook:WebHookController"],
		beego.ControllerComments{
			Method:           "GetHookEvents",
			Router:           `/events`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

}
