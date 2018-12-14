package namespace

import (
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"k8s.io/api/core/v1"
)

type Namespace struct {
	ObjectMeta common.ObjectMeta `json:"objectMeta"`
	Status     v1.NamespacePhase `json:"status"`
}

func toNamespace(namespace *v1.Namespace) *Namespace {
	result := &Namespace{
		ObjectMeta: common.NewObjectMeta(namespace.ObjectMeta),
	}
	result.Status = namespace.Status.Phase

	return result
}
