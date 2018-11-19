package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/publish:PublishController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/publish:PublishController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/histories`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/publish:PublishController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/publish:PublishController"],
		beego.ControllerComments{
			Method:           "Statistics",
			Router:           `/statistics`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

}
