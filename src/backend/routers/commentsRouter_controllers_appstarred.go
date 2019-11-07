package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const AppStarredController = "github.com/Qihoo360/wayne/src/backend/controllers/appstarred:AppStarredController"
    beego.GlobalControllerRouter[AppStarredController] = append(
        beego.GlobalControllerRouter[AppStarredController],
        beego.ControllerComments{
            Method: "Create",
            Router: `/`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:appId`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
