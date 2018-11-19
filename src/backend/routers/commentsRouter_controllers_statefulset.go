package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"],
		beego.ControllerComments{
			Method:           "GetNames",
			Router:           `/names`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetController"],
		beego.ControllerComments{
			Method:           "UpdateOrders",
			Router:           `/updateorders`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetTplController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetTplController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetTplController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetTplController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetTplController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetTplController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetTplController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetTplController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetTplController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/statefulset:StatefulsetTplController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

}
