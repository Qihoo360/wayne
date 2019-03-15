package secret

import (
	kapi "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/resources/common"
)

type SecretType string

type Secret struct {
	// metav1.TypeMeta `json:",inline"`
	ObjectMeta common.ObjectMeta `json:"objectMeta"`
	Data       map[string][]byte `json:"data,omitempty" protobuf:"bytes,2,rep,name=data"`
	StringData map[string]string `json:"stringData,omitempty" protobuf:"bytes,4,rep,name=stringData"`
	Type       SecretType        `json:"type,omitempty" protobuf:"bytes,3,opt,name=type,casttype=SecretType"`
}

func CreateOrUpdateSecret(cli *kubernetes.Clientset, secret *kapi.Secret) (*kapi.Secret, error) {
	old, err := cli.CoreV1().Secrets(secret.Namespace).Get(secret.Name, metaV1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return cli.CoreV1().Secrets(secret.Namespace).Create(secret)
		}
		return nil, err
	}
	old.Labels = secret.Labels
	old.Data = secret.Data

	return cli.CoreV1().Secrets(secret.Namespace).Update(old)
}

func DeleteSecret(cli *kubernetes.Clientset, name, namespace string) error {
	return cli.CoreV1().Secrets(namespace).Delete(name, &metaV1.DeleteOptions{})
}
