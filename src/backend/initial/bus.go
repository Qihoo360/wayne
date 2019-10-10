package initial

import (
	"github.com/Qihoo360/wayne/src/backend/bus"
	"github.com/Qihoo360/wayne/src/backend/bus/newbus"
	"github.com/astaxie/beego"
)

func InitBus() {
	var err error
	bus.DefaultBus, err = bus.NewBus(beego.AppConfig.String("BusRabbitMQURL"))
	if newbus.UBus == nil {
		newbus.UBus, err = newbus.NewBus()
		if err != nil {
			panic(err)
		}
	}

}
