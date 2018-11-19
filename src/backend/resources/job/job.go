package job

import (
	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/event"
	batchv1 "k8s.io/api/batch/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/kubernetes"
)

func GetJobsByCronjobName(cli *kubernetes.Clientset, namespace, cronjobName string) ([]batchv1.Job, error) {
	cronjob, err := cli.BatchV2alpha1().CronJobs(namespace).Get(cronjobName, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}

	jobSelector := labels.SelectorFromSet(cronjob.ObjectMeta.Labels).String()
	jobList, err := cli.BatchV1().Jobs(namespace).List(metaV1.ListOptions{LabelSelector: jobSelector})
	if err != nil {
		return nil, err
	}
	return jobList.Items, nil
}

func GetPodsEvent(cli *kubernetes.Clientset, indexer *client.CacheIndexer, namespace, jobName, cronjobName string) (common.PodInfo, error) {
	podInfo := common.PodInfo{}
	cronjob, err := cli.BatchV2alpha1().CronJobs(namespace).Get(cronjobName, metaV1.GetOptions{})
	if err != nil {
		return podInfo, err
	}

	labelDetail := cronjob.ObjectMeta.Labels
	labelDetail["job-name"] = jobName
	podSelector := labels.SelectorFromSet(labelDetail).String()
	podList, err := cli.CoreV1().Pods(namespace).List(metaV1.ListOptions{LabelSelector: podSelector})
	if err != nil {
		return podInfo, err
	}
	pods := podList.Items
	podInfo.Current = int32(len(pods))
	// 目前写死为1
	podInfo.Desired = 1
	podInfo.Warnings = event.GetPodsWarningEvents(indexer, pods)

	return podInfo, nil
}
