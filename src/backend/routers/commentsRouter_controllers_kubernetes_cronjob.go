package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/cronjob:KubeCronjobController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/cronjob:KubeCronjobController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:cronjob/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/cronjob:KubeCronjobController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/cronjob:KubeCronjobController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:cronjob/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/cronjob:KubeCronjobController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/cronjob:KubeCronjobController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/:cronjobId/tpls/:tplId/clusters/:cluster`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/cronjob:KubeCronjobController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/cronjob:KubeCronjobController"],
		beego.ControllerComments{
			Method:           "Suspend",
			Router:           `/:cronjobId/tpls/:tplId/clusters/:cluster/suspend`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

}
