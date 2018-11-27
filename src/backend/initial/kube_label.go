package initial

import (
	"github.com/Qihoo360/wayne/src/backend/util"
	"github.com/astaxie/beego"
)

func InitKubeLabel() {
	util.AppLabelKey = beego.AppConfig.DefaultString("AppLabelKey", "wayne-app")
	util.ComponentLabelKey = beego.AppConfig.DefaultString("ComponentLabelKey", "wayne-component")
	util.NamespaceLabelKey = beego.AppConfig.DefaultString("NamespaceLabelKey", "wayne-ns")
	util.PodAnnotationControllerKindLabelKey = beego.AppConfig.DefaultString("PodAnnotationControllerKindLabelKey", "wayne.cloud/controller-kind")
}
