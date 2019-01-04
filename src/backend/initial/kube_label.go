package initial

import (
	"github.com/astaxie/beego"

	"github.com/Qihoo360/wayne/src/backend/util"
)

func InitKubeLabel() {
	util.AppLabelKey = beego.AppConfig.DefaultString("AppLabelKey", "wayne-app")
	util.NamespaceLabelKey = beego.AppConfig.DefaultString("NamespaceLabelKey", "wayne-ns")
	util.PodAnnotationControllerKindLabelKey = beego.AppConfig.DefaultString("PodAnnotationControllerKindLabelKey", "wayne.cloud/controller-kind")
}
