package hpa

import (
	autoscaling "k8s.io/api/autoscaling/v1"

	"github.com/Qihoo360/wayne/src/backend/client"
	backendCommon "github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
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

func GetHPAPage(indexer *client.CacheFactory, namespace string, q *backendCommon.QueryParam) (page *backendCommon.Page, err error) {
	hpaPtrs, err := GetHPAList(indexer, namespace, nil)
	if err != nil {
		return nil, err
	}
	HPAs := make([]*HPA, len(hpaPtrs))
	for i := range hpaPtrs {
		HPAs[i] = toHPA(hpaPtrs[i])
	}
	return dataselector.DataSelectPage(toCells(HPAs), q), nil
}
