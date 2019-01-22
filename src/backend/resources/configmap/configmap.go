package configmap

import (
	kapi "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/resources/common"
)

type ConfigMap struct {
	// metav1.TypeMeta `json:",inline"`
	ObjectMeta common.ObjectMeta `json:"objectMeta"`
	Data       map[string]string `json:"data,omitempty" protobuf:"bytes,2,rep,name=data"`
}

func CreateOrUpdateConfigMap(cli *kubernetes.Clientset, configMap *kapi.ConfigMap) (*kapi.ConfigMap, error) {
	old, err := cli.CoreV1().ConfigMaps(configMap.Namespace).Get(configMap.Name, metaV1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return cli.CoreV1().ConfigMaps(configMap.Namespace).Create(configMap)
		}
		return nil, err
	}
	old.Labels = configMap.Labels
	old.Data = configMap.Data

	return cli.CoreV1().ConfigMaps(configMap.Namespace).Update(old)
}

func GetConfigMapDetail(cli *kubernetes.Clientset, name, namespace string) (*ConfigMap, error) {
	configmap, err := cli.CoreV1().ConfigMaps(namespace).Get(name, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}

	return &ConfigMap{
		ObjectMeta: common.NewObjectMeta(configmap.ObjectMeta),
		Data:       configmap.Data,
	}, nil
}

func DeleteConfigMap(cli *kubernetes.Clientset, name, namespace string) error {
	return cli.CoreV1().ConfigMaps(namespace).Delete(name, &metaV1.DeleteOptions{})
}
