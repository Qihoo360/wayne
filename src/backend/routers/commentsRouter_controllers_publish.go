package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const PublishController = "github.com/Qihoo360/wayne/src/backend/controllers/publish:PublishController"
    beego.GlobalControllerRouter[PublishController] = append(
        beego.GlobalControllerRouter[PublishController],
        beego.ControllerComments{
            Method: "List",
            Router: `/histories`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Statistics",
            Router: `/statistics`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
