package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/bill:BillController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/bill:BillController"],
		beego.ControllerComments{
			Method:           "ListInvoice",
			Router:           `/:appid`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/bill:BillController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/bill:BillController"],
		beego.ControllerComments{
			Method:           "ListCharge",
			Router:           `/:appid/:name`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

}
