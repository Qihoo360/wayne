package hookevent

type HookEvent struct {
	Key         string `json:"key"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

var (
	AllHookEvents = make(map[string]*HookEvent)

	EventDeployment = &HookEvent{
		Key:         "deployment",
		Name:        "Deployment(部署)",
		Description: "Related actions of \"deployment\", such as creation, online and offline, instance number adjustment, etc.",
	}

	EventService = &HookEvent{
		Key:         "service",
		Name:        "Service(负载均衡)",
		Description: "Related actions of \"Service\", such as the above online, offline, etc.",
	}

	EventIngress = &HookEvent{
		Key:         "ingress",
		Name:        "Ingress",
		Description: "Related actions of \"Ingress\", such as the above online, offline, etc.",
	}

	EventMember = &HookEvent{
		Key:         "member",
		Name:        "Member(成员)",
		Description: "Monitor the additions, deletions, or changes in permissions of members of a application or namespace.",
	}
)

func Registry(event *HookEvent) {
	AllHookEvents[event.Key] = event
}

func init() {
	Registry(EventDeployment)
	Registry(EventService)
	Registry(EventMember)
	Registry(EventIngress)
}
