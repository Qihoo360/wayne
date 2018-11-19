package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"],
		beego.ControllerComments{
			Method:           "Create",
			Router:           `/`,
			AllowHTTPMethods: []string{"post"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"],
		beego.ControllerComments{
			Method:           "List",
			Router:           `/`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"],
		beego.ControllerComments{
			Method:           "Update",
			Router:           `/:name`,
			AllowHTTPMethods: []string{"put"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"],
		beego.ControllerComments{
			Method:           "Get",
			Router:           `/:name`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"],
		beego.ControllerComments{
			Method:           "Delete",
			Router:           `/:name`,
			AllowHTTPMethods: []string{"delete"},
			MethodParams:     param.Make(),
			Params:           nil})

	beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/cluster:ClusterController"],
		beego.ControllerComments{
			Method:           "GetNames",
			Router:           `/names`,
			AllowHTTPMethods: []string{"get"},
			MethodParams:     param.Make(),
			Params:           nil})

}
