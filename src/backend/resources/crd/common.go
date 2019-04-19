package crd

import (
	apiextensions "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
)

// implements dataselector.DataCell
type CRDCell apiextensions.CustomResourceDefinition

// implements dataselector.DataCell
func (cell CRDCell) GetProperty(name dataselector.PropertyName) dataselector.ComparableValue {
	switch name {
	case dataselector.NameProperty:
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

// implements dataselector.DataCell
type CustomCRDCell CustomCRD

// implements dataselector.DataCell
func (cell CustomCRDCell) GetProperty(name dataselector.PropertyName) dataselector.ComparableValue {
	switch name {
	case dataselector.NameProperty:
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

type CustomCRD struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata"`

	Spec   interface{} `json:"spec"`
	Status interface{} `json:"status,omitempty"`
}

type CustomCRDList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata"`

	Items []CustomCRD `json:"items"`
}
