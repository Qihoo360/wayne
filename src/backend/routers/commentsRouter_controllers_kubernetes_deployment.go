package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/deployment:KubeDeploymentController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/deployment:KubeDeploymentController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/deployment:KubeDeploymentController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/deployment:KubeDeploymentController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:deployment`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/deployment:KubeDeploymentController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/deployment:KubeDeploymentController"],
		beego.ControllerComments{
			Method:           "Offline",
			Router:           `/:deployment`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/deployment:KubeDeploymentController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/deployment:KubeDeploymentController"],
		beego.ControllerComments{
			Method:           "Deploy",
			Router:           `/:deploymentId([0-9]+)/tpls/:tplId([0-9]+)`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

}
