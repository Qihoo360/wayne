package pv

import (
	"k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func ListPersistentVolume(cli *kubernetes.Clientset, listOptions metaV1.ListOptions) ([]v1.PersistentVolume, error) {
	pvList, err := cli.CoreV1().PersistentVolumes().List(listOptions)
	if err != nil {
		return nil, err
	}
	return pvList.Items, nil
}

func CreatePersistentVolume(cli *kubernetes.Clientset, pv *v1.PersistentVolume) (*v1.PersistentVolume, error) {
	pvCreated, err := cli.CoreV1().PersistentVolumes().Create(pv)
	if err != nil {
		return nil, err
	}
	return pvCreated, nil
}

func UpdatePersistentVolume(cli *kubernetes.Clientset, pv *v1.PersistentVolume) (*v1.PersistentVolume, error) {
	pvCreated, err := cli.CoreV1().PersistentVolumes().Update(pv)
	if err != nil {
		return nil, err
	}
	return pvCreated, nil
}

func DeletePersistentVolume(cli *kubernetes.Clientset, name string) error {
	return cli.CoreV1().PersistentVolumes().Delete(name, &metaV1.DeleteOptions{})
}

func GetPersistentVolumeByName(cli *kubernetes.Clientset, name string) (*v1.PersistentVolume, error) {
	return cli.CoreV1().
		PersistentVolumes().
		Get(name, metaV1.GetOptions{})
}
