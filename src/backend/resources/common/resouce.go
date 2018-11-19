package common

type Resource struct {
	Usage *ResourceList `json:"usage"`
	Limit *ResourceList `json:"limit"`
}

type ResourceList struct {
	Cpu    int64 `json:"cpu"`
	Memory int64 `json:"memory"`
}

type ResourceApp struct {
	Cpu    int64 `json:"cpu"`
	Memory int64 `json:"memory"`
	PodNum int64 `json:"pod_num"`
}
