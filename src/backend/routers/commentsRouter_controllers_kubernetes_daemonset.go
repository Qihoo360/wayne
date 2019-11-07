package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubeDaemonSetController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/daemonset:KubeDaemonSetController"
    beego.GlobalControllerRouter[KubeDaemonSetController] = append(
        beego.GlobalControllerRouter[KubeDaemonSetController],
        beego.ControllerComments{
            Method: "Get",
            Router: `/:daemonSet/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:daemonSet/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Create",
            Router: `/:daemonSetId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
