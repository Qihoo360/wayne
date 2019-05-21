package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/auth:AuthController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/auth:AuthController"],
		beego.ControllerComments{
			Method:           "CurrentUser",
			Router:           `/currentuser`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/auth:AuthController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/auth:AuthController"],
		beego.ControllerComments{
			Method:           "Login",
			Router:           `/login/:type/?:name`,
			AllowHTTPMethods: []string{"get", "post"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/auth:AuthController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/auth:AuthController"],
		beego.ControllerComments{
			Method:           "Logout",
			Router:           `/logout`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Filters:          nil,
			Params:           nil})

}
