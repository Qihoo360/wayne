package secret

import (
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	kapi "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
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

func GetSecretDetail(cli *kubernetes.Clientset, name, namespace string) (*Secret, error) {
	secret, err := cli.CoreV1().Secrets(namespace).Get(name, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}

	return &Secret{
		ObjectMeta: common.NewObjectMeta(secret.ObjectMeta),
		Data:       secret.Data,
	}, nil
}

func DeleteSecret(cli *kubernetes.Clientset, name, namespace string) error {
	return cli.CoreV1().Secrets(namespace).Delete(name, &metaV1.DeleteOptions{})
}
