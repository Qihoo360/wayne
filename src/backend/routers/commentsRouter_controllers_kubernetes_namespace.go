package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubeNamespaceController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/namespace:KubeNamespaceController"
    beego.GlobalControllerRouter[KubeNamespaceController] = append(
        beego.GlobalControllerRouter[KubeNamespaceController],
        beego.ControllerComments{
            Method: "Create",
            Router: `/:name/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Resources",
            Router: `/:namespaceid([0-9]+)/resources`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Statistics",
            Router: `/:namespaceid([0-9]+)/statistics`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
