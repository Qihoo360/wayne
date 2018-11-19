package common

import (
	"k8s.io/apimachinery/pkg/apis/meta/v1"
)

// Event is a single event representation.
type Event struct {
	ObjectMeta ObjectMeta `json:"objectMeta"`
	TypeMeta   TypeMeta   `json:"typeMeta"`

	// A human-readable description of the status of related object.
	Message string `json:"message"`

	// Component from which the event is generated.
	SourceComponent string `json:"sourceComponent"`

	Name string `json:"name"`

	// Reference to a piece of an object, which triggered an event. For example
	// "spec.containers{name}" refers to container within pod with given name, if no container
	// name is specified, for example "spec.containers[2]", then it refers to container with
	// index 2 in this pod.
	SubObject string `json:"object"`

	// The number of times this event has occurred.
	Count int32 `json:"count"`

	// The time at which the event was first recorded.
	FirstSeen v1.Time `json:"firstSeen"`

	// The time at which the most recent occurrence of this event was recorded.
	LastSeen v1.Time `json:"lastSeen"`

	// Short, machine understandable string that gives the reason
	// for this event being generated.
	Reason string `json:"reason"`

	// Event type (at the moment only normal and warning are supported).
	Type string `json:"type"`
}
