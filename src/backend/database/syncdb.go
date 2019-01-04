package main

import (
	"fmt"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"

	_ "github.com/Qihoo360/wayne/src/backend/plugins"
)

func init() {
	err := beego.LoadAppConfig("ini", "src/backend/conf/app.conf")
	if err != nil {
		panic(err)
	}
}

func main() {
	err := orm.RegisterDriver("mysql", orm.DRMySQL)
	if err != nil {
		panic(err)
	}
	dbURL := fmt.Sprintf("%s:%s@%s/%s?charset=utf8&", beego.AppConfig.String("DBUser"),
		beego.AppConfig.String("DBPasswd"), beego.AppConfig.String("DBTns"), beego.AppConfig.String("DBName"))
	// set timezone  , same as db timezone
	dbURL += beego.AppConfig.String("DBLoc")

	err = orm.RegisterDataBase("default", "mysql", dbURL)
	if err != nil {
		panic(err)
	}
	orm.RunCommand()
}
