package log

import (
	"io/ioutil"

	"k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
)

func GetLogsByPod(cli *kubernetes.Clientset, namespace, podName string, opt *v1.PodLogOptions) ([]byte, error) {
	req := cli.CoreV1().Pods(namespace).GetLogs(podName, opt)
	readCloser, err := req.Stream()
	if err != nil {
		return nil, err
	}

	defer readCloser.Close()

	return ioutil.ReadAll(readCloser)
}
