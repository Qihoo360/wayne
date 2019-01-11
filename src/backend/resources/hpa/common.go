package hpa

import (
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
)

// The code below allows to perform complex data section on []autoscaling.v1.HorizontalPodAutoscaler

type HPACell HPA

func (self HPACell) GetProperty(name dataselector.PropertyName) dataselector.ComparableValue {
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

func toCells(std []*HPA) []dataselector.DataCell {
	cells := make([]dataselector.DataCell, len(std))
	for i := range std {
		cells[i] = HPACell(*std[i])
	}
	return cells
}

func fromCells(cells []dataselector.DataCell) []HPA {
	std := make([]HPA, len(cells))
	for i := range std {
		std[i] = HPA(cells[i].(HPACell))
	}
	return std
}
