package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:KubePersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:KubePersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/:pvcId/tpls/:tplId/clusters/:cluster`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "ActiveImage",
			Router:           `/:pvc/rbd/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "InActiveImage",
			Router:           `/:pvc/rbd/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "DeleteSnapshot",
			Router:           `/:pvc/snapshot/:version/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "RollbackSnapshot",
			Router:           `/:pvc/snapshot/:version/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "CreateSnapshot",
			Router:           `/:pvc/snapshot/:version/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "ListSnapshot",
			Router:           `/:pvc/snapshot/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "DeleteAllSnapshot",
			Router:           `/:pvc/snapshot/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "GetPvcStatus",
			Router:           `/:pvc/status/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "OfflineImageUser",
			Router:           `/:pvc/user/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "LoginInfo",
			Router:           `/:pvc/user/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc:RobinPersistentVolumeClaimController"],
		beego.ControllerComments{
			Method:           "Verify",
			Router:           `/:pvc/verify/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

}
