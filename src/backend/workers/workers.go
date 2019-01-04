package workers

import (
	"encoding/json"
	"fmt"
	"os"
	"sync/atomic"

	"github.com/streadway/amqp"

	"github.com/Qihoo360/wayne/src/backend/bus"
	"github.com/Qihoo360/wayne/src/backend/bus/message"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

var (
	consumerSeq uint64
)

type Worker interface {
	Run() error
	Stop() error
}

type MessageWorker interface {
	Process(*message.Message) error
	Stop() error
}

type BaseMessageWorker struct {
	Bus      *bus.Bus
	queue    string
	consumer string
	stopChan chan struct{}

	MessageWorker
}

func NewBaseMessageWorker(b *bus.Bus, queue string) *BaseMessageWorker {
	consumer := fmt.Sprintf("ctag-%s-%d", os.Args[0], atomic.AddUint64(&consumerSeq, 1))
	return &BaseMessageWorker{b, queue, consumer, make(chan struct{}), nil}
}

func (w *BaseMessageWorker) Run() error {
	ch, err := w.Bus.Channel.Consume(w.queue, w.consumer, false, false, false, false, nil)
	if nil != err {
		return err
	}

	for {
		select {
		case delivery := <-ch:
			logs.Debug("Delivery received: %p", &delivery)
			processMessage(&delivery, w)
		case <-w.stopChan:
			logs.Info("WebhookWorker gracefully stopped")
			return nil
		}
	}

}

func processMessage(d *amqp.Delivery, w *BaseMessageWorker) {
	defer func() {
		if r := recover(); r != nil {
			logs.Critical(r)
			d.Reject(false)
		}
	}()

	var m message.Message
	err := json.Unmarshal(d.Body, &m)
	if err != nil {
		ackOrDie(d, false)
		return
	}
	if err = w.Process(&m); err != nil {
		logs.Error(err)
		ackOrDie(d, false) // 认为再次重试也无法处理
	} else {
		ackOrDie(d, false)
	}
}

func ackOrDie(d *amqp.Delivery, multiple bool) {
	if err := d.Ack(multiple); err != nil { // Client heartbeats failed? Lost connection. Cannot recover.
		logs.Critical(err)
		panic(err)
	}
}

func (w *BaseMessageWorker) Stop() error {
	close(w.stopChan)
	w.Bus.Channel.Cancel(w.consumer, true)
	logs.Debug("worker(consumer %s) stopped.", w.consumer)
	return nil
}
