package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/job:KubeJobController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/job:KubeJobController"],
		beego.ControllerComments{
			Method:           "GetPodsEvent",
			Router:           `/getPodsEvent/:job/:cronjob/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/job:KubeJobController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/job:KubeJobController"],
		beego.ControllerComments{
			Method:           "ListAllClusterByCronjob",
			Router:           `/listAllClusterByCronjob/:cronjob/namespaces/:namespace`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/job:KubeJobController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/job:KubeJobController"],
		beego.ControllerComments{
			Method:           "ListByCronjob",
			Router:           `/listByCronjob/:cronjob/namespaces/:namespace/clusters/:cluster`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

}
