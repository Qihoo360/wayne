package job

import (
	batchv1 "k8s.io/api/batch/v1"

	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
)

// implements dataselector.DataCell
type ObjectCell batchv1.Job

// implements dataselector.DataCell
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
