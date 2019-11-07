package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubeServiceController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/service:KubeServiceController"
    beego.GlobalControllerRouter[KubeServiceController] = append(
        beego.GlobalControllerRouter[KubeServiceController],
        beego.ControllerComments{
            Method: "Get",
            Router: `/:service/detail/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Create",
            Router: `/:serviceId/tpls/:tplId/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
