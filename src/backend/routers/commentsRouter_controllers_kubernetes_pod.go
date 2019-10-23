package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubePodController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pod:KubePodController"
    beego.GlobalControllerRouter[KubePodController] = append(
        beego.GlobalControllerRouter[KubePodController],
        beego.ControllerComments{
            Method: "Terminal",
            Router: `/:pod/terminal/namespaces/:namespace/clusters/:cluster`,
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
