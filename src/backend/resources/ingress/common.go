package ingress

import (
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
)

// The code below allows to perform complex data section on []extensions.Ingress

type IngressCell Ingress

func (self IngressCell) GetProperty(name dataselector.PropertyName) dataselector.ComparableValue {
	switch name {
	case dataselector.NameProperty:
		return dataselector.StdComparableString(self.ObjectMeta.Name)
	case dataselector.CreationTimestampProperty:
		return dataselector.StdComparableTime(self.ObjectMeta.CreationTimestamp.Time)
	case dataselector.NamespaceProperty:
		return dataselector.StdComparableString(self.ObjectMeta.Namespace)
	default:
		// if name is not supported then just return a constant dummy value, sort will have no effect.
		return nil
	}
}

func toCells(std []Ingress) []dataselector.DataCell {
	cells := make([]dataselector.DataCell, len(std))
	for i := range std {
		cells[i] = IngressCell(std[i])
	}
	return cells
}
