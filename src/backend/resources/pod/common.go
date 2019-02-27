package pod

import (
	"k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
)

type ObjectCell v1.Pod

func (cell ObjectCell) GetProperty(name dataselector.PropertyName) dataselector.ComparableValue {
	switch name {
	case dataselector.NameProperty:
		cell.GetObjectKind()
		return dataselector.StdComparableString(cell.ObjectMeta.Name)
	case dataselector.CreationTimestampProperty:
		return dataselector.StdComparableTime(cell.ObjectMeta.CreationTimestamp.Time)
	case dataselector.NamespaceProperty:
		return dataselector.StdComparableString(cell.ObjectMeta.Namespace)
	default:
		// if name is not supported then just return a constant dummy value, sort will have no effect.
		return nil
	}
}
