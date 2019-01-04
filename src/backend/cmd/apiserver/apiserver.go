package apiserver

import (
	"github.com/astaxie/beego"
	"github.com/spf13/cobra"

	"github.com/Qihoo360/wayne/src/backend/initial"
	_ "github.com/Qihoo360/wayne/src/backend/routers"
)

var (
	APIServerCmd = &cobra.Command{
		Use:    "apiserver",
		PreRun: preRun,
		Run:    run,
	}
)

func preRun(cmd *cobra.Command, args []string) {
}

func run(cmd *cobra.Command, args []string) {
	// MySQL
	initial.InitDb()

	// Swagger API
	if beego.BConfig.RunMode == "dev" {
		beego.BConfig.WebConfig.DirectoryIndex = true
		beego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"
	}

	// K8S Client
	initial.InitClient()

	// 初始化RabbitMQ
	busEnable := beego.AppConfig.DefaultBool("BusEnable", false)
	if busEnable {
		initial.InitBus()
	}

	// 初始化RsaPrivateKey
	initial.InitRsaKey()

	// init kube labels
	initial.InitKubeLabel()

	beego.Run()
}
