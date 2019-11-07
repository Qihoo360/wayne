package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
	const AuditLogController = "github.com/Qihoo360/wayne/src/backend/controllers/auditlog:AuditLogController"
    beego.GlobalControllerRouter[AuditLogController] = append(
    	beego.GlobalControllerRouter[AuditLogController],
        beego.ControllerComments{
            Method: "List",
            Router: `/`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
