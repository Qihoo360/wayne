package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:AppUserController"],
		beego.ControllerComments{
			Method:           "GetPermissionByApp",
			Router:           `/permissions/:id`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:GroupController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:GroupController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:GroupController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:GroupController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:GroupController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:GroupController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:GroupController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:GroupController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:GroupController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:GroupController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:NamespaceUserController"],
		beego.ControllerComments{
			Method:           "GetPermissionByNS",
			Router:           `/permissions/:id`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:PermissionController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:PermissionController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:PermissionController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:PermissionController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:PermissionController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:PermissionController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:PermissionController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:PermissionController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:PermissionController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:PermissionController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:id`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"],
		beego.ControllerComments{
			Method:           "UpdateAdmin",
			Router:           `/:id/admin`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"],
		beego.ControllerComments{
			Method:           "ResetPassword",
			Router:           `/:id/resetpassword`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"],
		beego.ControllerComments{
			Method:           "GetNames",
			Router:           `/names`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/permission:UserController"],
		beego.ControllerComments{
			Method:           "UserStatistics",
			Router:           `/statistics`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

}
