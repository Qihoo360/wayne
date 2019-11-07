package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const ConfigMapController = "github.com/Qihoo360/wayne/src/backend/controllers/publishstatus:PublishStatusController"
    beego.GlobalControllerRouter[ConfigMapController] = append(
        beego.GlobalControllerRouter[ConfigMapController],
        beego.ControllerComments{
            Method: "List",
            Router: `/`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:id`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
