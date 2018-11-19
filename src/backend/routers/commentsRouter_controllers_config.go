package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:BaseConfigController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:BaseConfigController"],
		beego.ControllerComments{
			Method:           "ListBase",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"],
		beego.ControllerComments{
			Method:           "ListSystem",
			Router:           `/system`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

}
