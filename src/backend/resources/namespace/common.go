package namespace

import (
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"k8s.io/api/core/v1"
)

type Namespace struct {
	ObjectMeta common.ObjectMeta `json:"objectMeta"`
}

func toNamespace(deployment *v1.Namespace) *Namespace {
	result := &Namespace{
		ObjectMeta: common.NewObjectMeta(deployment.ObjectMeta),
	}

	return result
}
