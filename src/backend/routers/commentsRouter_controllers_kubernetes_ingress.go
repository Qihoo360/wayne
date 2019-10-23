package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubeIngressController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/ingress:KubeIngressController"
    beego.GlobalControllerRouter[KubeIngressController] = append(
        beego.GlobalControllerRouter[KubeIngressController],
        beego.ControllerComments{
            Method: "Create",
            Router: `/:ingressId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
