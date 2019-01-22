package bus

import (
	"encoding/json"

	"github.com/streadway/amqp"

	"github.com/Qihoo360/wayne/src/backend/bus/message"
)

var DefaultBus *Bus

const (
	QueueWebhook = "webhook"
	QueueAudit   = "audit"

	RoutingKeyRequest = "request"
)

type Bus struct {
	Name    string
	Url     string
	Conn    *amqp.Connection
	Channel *amqp.Channel
}

func NewBus(url string) (*Bus, error) {
	bus := &Bus{Name: "wayne", Url: url}
	conn, err := amqp.Dial(bus.Url)
	if err != nil {
		return nil, err
	}
	bus.Conn = conn
	channel, err := conn.Channel()
	if err != nil {
		return nil, err
	}
	bus.Channel = channel

	if err := bus.Init(); err != nil {
		return nil, err
	}

	return bus, nil
}

func (bus *Bus) Init() error {
	// Exchange
	if err := bus.Channel.ExchangeDeclare(bus.Name, amqp.ExchangeDirect, true, false, false, false, nil); err != nil {
		return err
	}

	return nil
}

func Notify(msg message.Message) error {
	if DefaultBus == nil { // Feature is not enabled
		return nil
	}

	msgStr, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	err = DefaultBus.Channel.Publish(
		DefaultBus.Name,
		RoutingKeyRequest,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        msgStr,
		},
	)
	return err
}
