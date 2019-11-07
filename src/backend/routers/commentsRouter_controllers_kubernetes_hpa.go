package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubeHPAController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/hpa:KubeHPAController"
    beego.GlobalControllerRouter[KubeHPAController] = append(
        beego.GlobalControllerRouter[KubeHPAController],
        beego.ControllerComments{
            Method: "Create",
            Router: `/:hpaId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
