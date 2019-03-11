package proxy

import (
	"k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
)

type ObjectCell common.Object

func (cell ObjectCell) GetProperty(name dataselector.PropertyName) dataselector.ComparableValue {
	return baseProperty(name, cell.ObjectMeta)
}

func baseProperty(name dataselector.PropertyName, meta metav1.ObjectMeta) dataselector.ComparableValue {
	switch name {
	case dataselector.NameProperty:
		return dataselector.StdComparableString(meta.Name)
	case dataselector.CreationTimestampProperty:
		return dataselector.StdComparableTime(meta.CreationTimestamp.Time)
	case dataselector.NamespaceProperty:
		return dataselector.StdComparableString(meta.Namespace)
	default:
		// if name is not supported then just return a constant dummy value, sort will have no effect.
		return nil
	}
}

type PodCell v1.Pod

func (cell PodCell) GetProperty(name dataselector.PropertyName) dataselector.ComparableValue {
	switch name {
	case dataselector.PodIPProperty:
		return dataselector.StdComparableString(cell.Status.PodIP)
	case dataselector.NodeNameProperty:
		return dataselector.StdComparableString(cell.Spec.NodeName)
	default:
		// if name is not supported then just return a constant dummy value, sort will have no effect.
		return baseProperty(name, cell.ObjectMeta)
	}
}
