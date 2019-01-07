package response

import (
	"time"

	"github.com/Qihoo360/wayne/src/backend/models"
)

// for getnames api
type NamesObject struct {
	Id   int64  `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}

type User struct {
	Name    string   `json:"name,omitempty"`
	Email   string   `json:"email,omitempty"`
	Display string   `json:"display,omitempty"`
	Roles   []string `json:"roles,omitempty"`
}

func (u *User) LoadFromModel(m models.User) {
	u.Name = m.Name
	u.Email = m.Email
	u.Display = m.Display
}

type Namespace struct {
	Id         int64      `json:"id"`
	Name       string     `json:"name"`
	CreateTime *time.Time `json:"createTime"`
	UpdateTime *time.Time `json:"updateTime"`
	User       string     `json:"user"`
}

type App struct {
	Id          int64      `json:"id,omitempty"`
	Name        string     `json:"name,omitempty"`
	Namespace   string     `json:"namespace,omitempty"`
	Description string     `json:"description,omitempty"`
	User        string     `json:"user,omitempty"`
	Deleted     bool       `json:"deleted,omitempty"`
	CreateTime  *time.Time `json:"createTime,omitempty"`
	UpdateTime  *time.Time `json:"updateTime,omitempty"`
}

type Service struct {
	Name           string            `json:"name,omitempty"`
	Labels         map[string]string `json:"labels,omitempty"`
	Selector       map[string]string `json:"selector,omitempty"`
	Type           string            `json:"type,omitempty"`
	LoadBalancerIP string            `json:"loadBalancerIp,omitempty"`
	IP             string            `json:"ip,omitempty"`
	ExternalIP     []string          `json:"externalIp,omitempty"`
	Ports          []Port            `json:"ports,omitempty"`
}

type Port struct {
	Port       string   `json:"port,omitempty"`
	TargetPort string   `json:"targetPort,omitempty"`
	NodePort   string   `json:"nodePort,omitempty"`
	Endpoints  []string `json:"endpoints,omitempty"`
}

type Pod struct {
	Name            string            `json:"name,omitempty"`
	Namespace       string            `json:"namespace,omitempty"`
	ContainerStatus []ContainerStatus `json:"containerStatus,omitempty"`
	State           string            `json:"state,omitempty"`
	PodIp           string            `json:"podIp,omitempty"`
	NodeName        string            `json:"nodeName,omitempty"`
	StartTime       *time.Time        `json:"startTime,omitempty"`
	Labels          map[string]string `json:"labels,omitempty"`
}

type ContainerStatus struct {
	Name         string `json:"name,omitempty"`
	RestartCount int32  `json:"restartCount"`
}

type Deployment struct {
	Name       string            `json:"name,omitempty"`
	Namespace  string            `json:"namespace,omitempty"`
	Labels     map[string]string `json:"labels,omitempty"`
	CreateTime time.Time         `json:"createTime,omitempty"`
	PodsState  PodInfo           `json:"podState,omitempty"`
}

type PodInfo struct {
	Current   int32    `json:"current"`
	Desired   int32    `json:"desired"`
	Running   int32    `json:"running"`
	Pending   int32    `json:"pending"`
	Failed    int32    `json:"failed"`
	Succeeded int32    `json:"succeeded"`
	Warnings  []string `json:"warnings"`
}

type Resource struct {
	Type         models.PublishType   `json:"type"`
	ResourceId   int64                `json:"resourceId,omitempty"`
	ResourceName string               `json:"resourceName,omitempty"`
	TemplateId   int64                `json:"templateId,omitempty"`
	Cluster      string               `json:"cluster,omitempty"`
	Status       models.ReleaseStatus `json:"status,omitempty"`
	Message      string               `json:"message,omitempty"`
	Object       interface{}          `json:"object,omitempty"` // 用于存储 kubernetes 资源对象的配置细节
}

// OpenAPI 通用 失败 返回接口
// swagger:response responseState
type Failure struct {
	// in: body
	// Required: true
	Body struct {
		ResponseBase
		Errors []string `json:"errors"`
	}
}

type ResponseBase struct {
	Code int `json:"code"`
}

// OpenAPI 通用 成功 返回接口
// swagger:response responseSuccess
type Success struct {
	// in: body
	// Required: true
	Body struct {
		ResponseBase
	}
}
