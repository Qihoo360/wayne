package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubeDeploymentController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/deployment:KubeDeploymentController"
    beego.GlobalControllerRouter[KubeDeploymentController] = append(
        beego.GlobalControllerRouter[KubeDeploymentController],
        beego.ControllerComments{
            Method: "Get",
            Router: `/:deployment/detail/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:deployment/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Create",
            Router: `/:deploymentId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "List",
            Router: `/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
