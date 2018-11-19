package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/appstarred:AppStarredController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/appstarred:AppStarredController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/appstarred:AppStarredController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/appstarred:AppStarredController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:appId`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

}
