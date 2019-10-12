package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const KubePersistentVolumeClaimController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:KubePersistentVolumeClaimController"
    beego.GlobalControllerRouter[KubePersistentVolumeClaimController] = append(
        beego.GlobalControllerRouter[KubePersistentVolumeClaimController],
        beego.ControllerComments{
            Method: "Create",
            Router: `/:pvcId/tpls/:tplId/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    const RobinPersistentVolumeClaimController = "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"
    beego.GlobalControllerRouter[RobinPersistentVolumeClaimController] = append(
        beego.GlobalControllerRouter[RobinPersistentVolumeClaimController],
        beego.ControllerComments{
            Method: "ActiveImage",
            Router: `/:pvc/rbd/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "InActiveImage",
            Router: `/:pvc/rbd/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "DeleteSnapshot",
            Router: `/:pvc/snapshot/:version/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "RollbackSnapshot",
            Router: `/:pvc/snapshot/:version/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "CreateSnapshot",
            Router: `/:pvc/snapshot/:version/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "ListSnapshot",
            Router: `/:pvc/snapshot/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "DeleteAllSnapshot",
            Router: `/:pvc/snapshot/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "GetPvcStatus",
            Router: `/:pvc/status/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "OfflineImageUser",
            Router: `/:pvc/user/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "LoginInfo",
            Router: `/:pvc/user/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Verify",
            Router: `/:pvc/verify/namespaces/:namespace/clusters/:cluster`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
