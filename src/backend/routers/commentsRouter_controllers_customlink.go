package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"],
        beego.ControllerComments{
            Method: "List",
            Router: `/`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"],
        beego.ControllerComments{
            Method: "Create",
            Router: `/`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"],
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:id`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"],
        beego.ControllerComments{
            Method: "Update",
            Router: `/:id([0-9]+)`,
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"],
        beego.ControllerComments{
            Method: "Get",
            Router: `/:id([0-9]+)`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"],
        beego.ControllerComments{
            Method: "ChangeStatus",
            Router: `/:id/status`,
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"],
        beego.ControllerComments{
            Method: "List",
            Router: `/`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"],
        beego.ControllerComments{
            Method: "Create",
            Router: `/`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"],
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:id`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"],
        beego.ControllerComments{
            Method: "Update",
            Router: `/:id([0-9]+)`,
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"],
        beego.ControllerComments{
            Method: "Get",
            Router: `/:id([0-9]+)`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:ShowLinkController"] = append(beego.GlobalControllerRouter["github.com/Qihoo360/wayne/src/backend/controllers/customlink:ShowLinkController"],
        beego.ControllerComments{
            Method: "List",
            Router: `/links`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
