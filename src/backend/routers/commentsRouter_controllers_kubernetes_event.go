package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubeEventController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/event:KubeEventController"
    beego.GlobalControllerRouter[KubeEventController] = append(
        beego.GlobalControllerRouter[KubeEventController],
        beego.ControllerComments{
            Method: "List",
            Router: `/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
