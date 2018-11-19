package models_test

import (
	"fmt"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
)

func init() {
	_, file, _, _ := runtime.Caller(1)
	appPath, _ := filepath.Abs(filepath.Dir(filepath.Join(file, ".."+string(filepath.Separator))))
	beego.TestBeegoInit(getParentDirectory(appPath))
	initDb()
}

func initDb() {

	orm.RegisterDriver("mysql", orm.DRMySQL)

	dbURL := fmt.Sprintf("%s:%s@%s/%s?charset=utf8&", beego.AppConfig.String("DBUser"),
		beego.AppConfig.String("DBPasswd"), beego.AppConfig.String("DBTns"), beego.AppConfig.String("DBName"))
	// set timezone  , same as db timezone
	dbURL += beego.AppConfig.String("DBLoc")
	orm.RegisterDataBase("default", "mysql", dbURL)

	orm.Debug = beego.AppConfig.DefaultBool("ShowSql", false)
}

func getParentDirectory(dirctory string) string {
	return substr(dirctory, 0, strings.LastIndex(dirctory, "/"))
}

func substr(s string, pos, length int) string {
	runes := []rune(s)
	l := pos + length
	if l > len(runes) {
		l = len(runes)
	}
	return string(runes[pos:l])
}
