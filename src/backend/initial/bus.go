package initial

import (
	"github.com/astaxie/beego"

	"github.com/Qihoo360/wayne/src/backend/bus"
)

func InitBus() {
	var err error
	bus.DefaultBus, err = bus.NewBus(beego.AppConfig.String("BusRabbitMQURL"))
	if err != nil {
		panic(err)
	}
}
