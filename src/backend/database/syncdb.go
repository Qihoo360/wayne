package main

import (
	"github.com/Qihoo360/wayne/src/backend/initial"
	_ "github.com/Qihoo360/wayne/src/backend/plugins"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
)

func init() {
	err := beego.LoadAppConfig("ini", "src/backend/conf/app.conf")
	if err != nil {
		panic(err)
	}
}

func main() {
	initial.InitDb()
	orm.RunCommand()
}
