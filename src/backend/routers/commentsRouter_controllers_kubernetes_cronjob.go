package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubeCronjobController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/cronjob:KubeCronjobController"
    beego.GlobalControllerRouter[KubeCronjobController] = append(
        beego.GlobalControllerRouter[KubeCronjobController],
        beego.ControllerComments{
            Method: "Get",
            Router: `/:cronjob/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:cronjob/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Create",
            Router: `/:cronjobId/tpls/:tplId/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Suspend",
            Router: `/:cronjobId/tpls/:tplId/clusters/:cluster/suspend`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
