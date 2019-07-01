package common

import (
	"encoding/json"

	"k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
)

// TODO convert runtime.Object to real type
// for common kubernetes Object
type Object struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	// for ServiceAccount
	Secrets []v1.ObjectReference `json:"secrets,omitempty"`

	// for StorageClass
	Provisioner   string                            `json:"provisioner,omitempty"`
	ReclaimPolicy *v1.PersistentVolumeReclaimPolicy `json:"reclaimPolicy,omitempty"`

	// for endpoint only
	Subsets interface{} `json:"subsets,omitempty"`
	// for secret and configmap
	Type interface{} `json:"type,omitempty"`
	Data interface{} `json:"data,omitempty"`

	Spec   interface{} `json:"spec,omitempty"`
	Status interface{} `json:"status,omitempty"`
}

// ReplicaSet ensures that a specified number of pod replicas are running at any given time.
type BaseObject struct {
	metav1.TypeMeta `json:",inline"`

	// If the Labels of a ReplicaSet are empty, they are defaulted to
	// be the same as the Pod(s) that the ReplicaSet manages.
	// Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata
	// +optional
	metav1.ObjectMeta `json:"metadata,omitempty"`
}

func ToBaseObject(obj runtime.Object) (*BaseObject, error) {
	objByte, err := json.Marshal(obj)
	if err != nil {
		return nil, err
	}
	var commonObj BaseObject
	err = json.Unmarshal(objByte, &commonObj)
	if err != nil {
		return nil, err
	}
	return &commonObj, nil
}
