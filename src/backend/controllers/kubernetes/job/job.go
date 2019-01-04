package job

import (
	batchv1 "k8s.io/api/batch/v1"
	"k8s.io/apimachinery/pkg/api/errors"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/job"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubeJobController struct {
	base.APIController
}

type ClusterJob struct {
	Job     batchv1.Job `json:"kubeJob"`
	Cluster string      `json:"cluster"`
}

func (c *KubeJobController) URLMapping() {
	c.Mapping("ListByCronjob", c.ListByCronjob)
	c.Mapping("ListAllClusterByCronjob", c.ListAllClusterByCronjob)
	c.Mapping("GetPodsEvent", c.GetPodsEvent)
}

func (c *KubeJobController) Prepare() {
	// Check administration
	c.APIController.Prepare()
}

// @Title Get
// @Description find Job by cluster
// @Success 200 {object} models.Job success
// @router /listByCronjob/:cronjob/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeJobController) ListByCronjob() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	cronjobName := c.Ctx.Input.Param(":cronjob")
	cli, err := client.Client(cluster)
	if err == nil {
		jobs, err := job.GetJobsByCronjobName(cli, namespace, cronjobName)
		if err != nil {
			logs.Error("get job by cronjob (%s) and cluster (%s) error.%v", cronjobName, cluster, err)
			c.HandleError(err)
			return
		}
		c.Success(jobs)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title Get
// @Description find Job by cluster
// @Success 200 {object} models.Job success
// @router /listAllClusterByCronjob/:cronjob/namespaces/:namespace [get]
func (c *KubeJobController) ListAllClusterByCronjob() {
	namespace := c.Ctx.Input.Param(":namespace")
	cronjobName := c.Ctx.Input.Param(":cronjob")
	clusters, err := models.ClusterModel.GetNames(false)
	if err != nil {
		logs.Error("get cluster error. %v", err)
		c.HandleError(err)
		return
	}
	var allJobs []ClusterJob
	for _, cluster := range clusters {
		cli, err := client.Client(cluster.Name)
		if err == nil {
			jobs, err := job.GetJobsByCronjobName(cli, namespace, cronjobName)
			if err != nil {
				if errors.IsNotFound(err) {
					continue
				}
				logs.Error("get job by cronjob (%s) and cluster (%s) error.%v", cronjobName, cluster, err)
				c.HandleError(err)
				return
			}
			for _, job := range jobs {
				oneJob := ClusterJob{
					Job:     job,
					Cluster: cluster.Name,
				}
				allJobs = append(allJobs, oneJob)
			}
		} else {
			c.AbortBadRequestFormat("Cluster")
		}
	}
	c.Success(allJobs)
}

// @Title Get
// @Description find job by cluster
// @Success 200 {object} models.Job success
// @router /getPodsEvent/:job/:cronjob/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeJobController) GetPodsEvent() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":job")
	cronjobName := c.Ctx.Input.Param(":cronjob")
	manager, err := client.Manager(cluster)
	if err == nil {
		result, err := job.GetPodsEvent(manager.Client, manager.CacheFactory, namespace, name, cronjobName)
		if err != nil {
			logs.Error("get kubernetes job pods event error.", cluster, namespace, name, err)
			c.HandleError(err)
			return
		}
		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}
