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
		Name:        "部署",
		Description: "部署相关动作行为，如创建、上下线、实例数量调整等",
	}

	EventService = &HookEvent{
		Key:         "service",
		Name:        "负载均衡",
		Description: "负载均衡相关动作行为，如上下线等",
	}

	EventIngress = &HookEvent{
		Key:         "ingress",
		Name:        "Ingress",
		Description: "Ingress 相关动作行为，如上下线等",
	}

	EventMember = &HookEvent{
		Key:         "member",
		Name:        "成员",
		Description: "项目/部门成员增删或权限变更",
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
