package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "Get",
            Router: `/:name/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "Update",
            Router: `/:name/clusters/:cluster`,
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:name/clusters/:cluster`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "AddLabel",
            Router: `/:name/clusters/:cluster/label`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "DeleteLabel",
            Router: `/:name/clusters/:cluster/label`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "GetLabels",
            Router: `/:name/clusters/:cluster/labels`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "AddLabels",
            Router: `/:name/clusters/:cluster/labels`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "DeleteLabels",
            Router: `/:name/clusters/:cluster/labels`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "SetTaint",
            Router: `/:name/clusters/:cluster/taint`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "DeleteTaint",
            Router: `/:name/clusters/:cluster/taint`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "List",
            Router: `/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node:KubeNodeController"],
        beego.ControllerComments{
            Method: "NodeStatistics",
            Router: `/statistics`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
