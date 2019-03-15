package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/statefulset:KubeStatefulsetController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/statefulset:KubeStatefulsetController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:statefulset/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/statefulset:KubeStatefulsetController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/statefulset:KubeStatefulsetController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/:statefulsetId([0-9]+)/tpls/:tplId([0-9]+)/clusters/:cluster`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

}
