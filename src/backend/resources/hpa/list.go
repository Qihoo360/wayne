package hpa

import (
	autoscaling "k8s.io/api/autoscaling/v1"

	"github.com/Qihoo360/wayne/src/backend/resources/common"
)

type HPA struct {
	common.ObjectMeta `json:"objectMeta"`
	common.TypeMeta   `json:"typeMeta"`
	//ScaleTargetRef                  ScaleTargetRef `json:"scaleTargetRef"`
	MinReplicas                     *int32 `json:"minReplicas"`
	MaxReplicas                     int32  `json:"maxReplicas"`
	CurrentCPUUtilizationPercentage *int32 `json:"currentCPUUtilizationPercentage"`
	TargetCPUUtilizationPercentage  *int32 `json:"targetCPUUtilizationPercentage"`
}

func toHPA(hpa *autoscaling.HorizontalPodAutoscaler) *HPA {
	modelHPA := HPA{
		ObjectMeta: common.NewObjectMeta(hpa.ObjectMeta),
		TypeMeta:   common.NewTypeMeta("HorizontalPodAutoscaler"),

		MinReplicas:                     hpa.Spec.MinReplicas,
		MaxReplicas:                     hpa.Spec.MaxReplicas,
		CurrentCPUUtilizationPercentage: hpa.Status.CurrentCPUUtilizationPercentage,
		TargetCPUUtilizationPercentage:  hpa.Spec.TargetCPUUtilizationPercentage,
	}
	return &modelHPA
}
