package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id([0-9]+)`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"],
		beego.ControllerComments{
			Method:           "Statistics",
			Router:           `/:id([0-9]+)/statistics`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"],
		beego.ControllerComments{
			Method:           "History",
			Router:           `/:id/history`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"],
		beego.ControllerComments{
			Method:           "InitDefault",
			Router:           `/init`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/namespace:NamespaceController"],
		beego.ControllerComments{
			Method:           "GetNames",
			Router:           `/names`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

}
