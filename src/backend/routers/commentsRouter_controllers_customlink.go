package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const CustomLinkController = "github.com/Qihoo360/wayne/src/backend/controllers/customlink:CustomLinkController"
    beego.GlobalControllerRouter[CustomLinkController] = append(
        beego.GlobalControllerRouter[CustomLinkController],
        beego.ControllerComments{
            Method: "List",
            Router: `/`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Create",
            Router: `/`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:id`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Update",
            Router: `/:id([0-9]+)`,
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Get",
            Router: `/:id([0-9]+)`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "ChangeStatus",
            Router: `/:id/status`,
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })

    const LinkTypeController = "github.com/Qihoo360/wayne/src/backend/controllers/customlink:LinkTypeController"
    beego.GlobalControllerRouter[LinkTypeController] = append(
        beego.GlobalControllerRouter[LinkTypeController],
        beego.ControllerComments{
            Method: "List",
            Router: `/`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Create",
            Router: `/`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Delete",
            Router: `/:id`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Update",
            Router: `/:id([0-9]+)`,
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "Get",
            Router: `/:id([0-9]+)`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })

    const ShowLinkController = "github.com/Qihoo360/wayne/src/backend/controllers/customlink:ShowLinkController"
    beego.GlobalControllerRouter[ShowLinkController] = append(
        beego.GlobalControllerRouter[ShowLinkController],
        beego.ControllerComments{
            Method: "List",
            Router: `/links`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
