package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {
    const BaseConfigController= "github.com/Qihoo360/wayne/src/backend/controllers/config:BaseConfigController"
    beego.GlobalControllerRouter[BaseConfigController] = append(
        beego.GlobalControllerRouter[BaseConfigController],
        beego.ControllerComments{
            Method:           "ListBase",
            Router:           `/`,
            AllowHTTPMethods: []string{"get"},
            MethodParams:     param.Make(),
            Filters:          nil,
            Params:           nil,
        })
    const ConfigController="github.com/Qihoo360/wayne/src/backend/controllers/config:ConfigController"
    beego.GlobalControllerRouter[ConfigController] = append(beego.GlobalControllerRouter[ConfigController],
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
            Method: "Delete",
            Router: `/:id([0-9]+)`,
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        },
        beego.ControllerComments{
            Method: "ListSystem",
            Router: `/system`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil,
        })
}
