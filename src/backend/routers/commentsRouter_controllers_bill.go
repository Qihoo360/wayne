package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const BillController = "github.com/Qihoo360/wayne/src/backend/controllers/bill:BillController"
    beego.GlobalControllerRouter[BillController] = append(
        beego.GlobalControllerRouter[BillController],
        beego.ControllerComments{
            Method: "ListInvoice",
            Router: `/:appid`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "ListCharge",
            Router: `/:appid/:name`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
