package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubePersistentVolumeController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pv:KubePersistentVolumeController"
    beego.GlobalControllerRouter[KubePersistentVolumeController] = append(
        beego.GlobalControllerRouter[KubePersistentVolumeController],
        beego.ControllerComments{
            Method: "Get",
            Router: `/:name/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Update",
            Router: `/:name/clusters/:cluster`,
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:name/clusters/:cluster`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "List",
            Router: `/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Create",
            Router: `/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })

    const RobinPersistentVolumeController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pv:RobinPersistentVolumeController"
    beego.GlobalControllerRouter[RobinPersistentVolumeController] = append(
        beego.GlobalControllerRouter[RobinPersistentVolumeController],
        beego.ControllerComments{
            Method: "ListRbdImages",
            Router: `/rbd.images/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "CreateRbdImage",
            Router: `/rbd.images/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
