package job

import (
	batchv1 "k8s.io/api/batch/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/event"
	"github.com/Qihoo360/wayne/src/backend/resources/pod"
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

func GetPodsEvent(cli *kubernetes.Clientset, indexer *client.CacheFactory, namespace, jobName, cronjobName string) (common.PodInfo, error) {
	podInfo := common.PodInfo{}
	cronjob, err := cli.BatchV2alpha1().CronJobs(namespace).Get(cronjobName, metaV1.GetOptions{})
	if err != nil {
		return podInfo, err
	}

	labelDetail := cronjob.ObjectMeta.Labels
	labelDetail["job-name"] = jobName

	pods, err := pod.ListKubePod(indexer, namespace, labelDetail)
	if err != nil {
		return podInfo, err
	}

	podInfo.Current = int32(len(pods))
	// 目前写死为1
	podInfo.Desired = 1

	podInfo.Warnings, err = event.GetPodsWarningEvents(indexer, pods)
	if err != nil {
		return common.PodInfo{}, err
	}

	return podInfo, nil
}
