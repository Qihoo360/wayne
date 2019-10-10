package newbus

import (
	"errors"
	"sync"

	"github.com/Qihoo360/wayne/src/backend/bus/message"
)

var UBus *Bus

// DataChannel 是一个能接收 message 的 channel
type DataChannel chan message.Message

// HandlerFunc defines a handler function interface.
type HandlerFunc func(msg *message.Message) error

// EventMsg save event message
type EventInfo struct {
	EventMsg    DataChannel
	HandlerFunc HandlerFunc
}

// Bus存储event消息channel及其handler
// Events map{eventName: eventInfo}
type Bus struct {
	Events map[string]*EventInfo
	mu     sync.RWMutex
}

func (b *Bus) RegisterHandler(event string, handlerfunc HandlerFunc) error {
	if _, ok := b.Events[event]; !ok {
		b.mu.Lock()
		ch := make(DataChannel, 100)
		eventInfo := &EventInfo{
			EventMsg:    ch,
			HandlerFunc: handlerfunc,
		}
		b.Events[event] = eventInfo
		b.mu.Unlock()
	} else {
		return errors.New("handler已存在")
	}
	go b.Dispatch(event)
	return nil
}

func (b *Bus) Publish(event string, msg message.Message) error {
	if UBus == nil { // Feature is not enabled
		return nil
	}
	b.mu.RLock()
	if eventinfo, found := b.Events[event]; found {
		channel := eventinfo.EventMsg
		go func(mg message.Message, ch *DataChannel) {
			*ch <- mg
		}(msg, &channel)
	} else {
		return errors.New(" No webhook handler found")
	}
	b.mu.RUnlock()
	return nil
}

func NewBus() (*Bus, error) {
	bus := &Bus{
		Events: make(map[string]*EventInfo),
	}
	return bus, nil
}

func (b *Bus) Dispatch(event string) {
	e := b.Events[event]
	for {
		// e := b.Events[event]
		select {
		case msg := <-e.EventMsg:
			// e.HandlerFunc(&msg)
			go e.HandlerFunc(&msg)
		}
	}
}
