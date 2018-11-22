package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/ingress:KubeIngressController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/ingress:KubeIngressController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:ingress/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil,
		},
		beego.ControllerComments{
			Method:           "offline",
			Router:           `/:ingress/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil,
		},
		beego.ControllerComments{
			Method:           "Deploy",
			Router:           `/:ingressId/tpls/:tplId/clusters/:cluster`,
			AllowHTTPMethods: []string{"port"},
			MethodParams:     param.Make(),
			Params:           nil,
		})

}
