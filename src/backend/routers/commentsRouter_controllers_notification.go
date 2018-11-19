package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/notification:NotificationController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/notification:NotificationController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/notification:NotificationController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/notification:NotificationController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/notification:NotificationController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/notification:NotificationController"],
		beego.ControllerComments{
			Method:           "Publish",
			Router:           `/`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/notification:NotificationController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/notification:NotificationController"],
		beego.ControllerComments{
			Method:           "Subscribe",
			Router:           `/subscribe`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/notification:NotificationController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/notification:NotificationController"],
		beego.ControllerComments{
			Method:           "Read",
			Router:           `/subscribe`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

}
