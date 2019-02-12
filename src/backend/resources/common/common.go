package common

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// TODO convert runtime.Object to real type
// for common kubernetes Object
type Object struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	// for endpoint only
	Subsets interface{} `json:"subsets,omitempty"`
	// for secret and configmap
	Type interface{} `json:"type,omitempty"`
	Data interface{} `json:"data,omitempty"`

	Spec   interface{} `json:"spec,omitempty"`
	Status interface{} `json:"status,omitempty"`
}
