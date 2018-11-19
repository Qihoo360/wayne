package initial

import (
	"github.com/Qihoo360/wayne/src/backend/bus"
	"github.com/astaxie/beego"
)

func InitBus() {
	var err error
	bus.DefaultBus, err = bus.NewBus(beego.AppConfig.String("BusRabbitMQURL"))
	if err != nil {
		panic(err)
	}
}
