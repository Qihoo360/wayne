package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubeConfigMapController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/configmap:KubeConfigMapController"
    beego.GlobalControllerRouter[KubeConfigMapController] = append(
        beego.GlobalControllerRouter[KubeConfigMapController],
        beego.ControllerComments{
            Method: "Create",
            Router: `/:configMapId/tpls/:tplId/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
