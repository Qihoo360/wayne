package service

import "github.com/Qihoo360/wayne/src/backend/resources/dataselector"

type ServiceCell Service

func (self ServiceCell) GetProperty(name dataselector.PropertyName) dataselector.ComparableValue {
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

func toCell(std []Service) []dataselector.DataCell {
	cells := make([]dataselector.DataCell, len(std))
	for i := range std {
		cells[i] = ServiceCell(std[i])
	}
	return cells
}
