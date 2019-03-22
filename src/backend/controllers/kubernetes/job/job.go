package job

import (
	batchv1 "k8s.io/api/batch/v1"

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
	c.Mapping("ListJobByCronJob", c.ListJobByCronJob)
}

func (c *KubeJobController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"ListJobByCronJob": models.PermissionRead,
		"GetEvent":         models.PermissionRead,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubeJob)
}

// @Title ListJobByCronJob
// @Description find jobs by cronjob
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	true		"the cronjob name."
// @Param	cluster		query 	string	true		"the cluster name."
// @Success 200 {object} models.Deployment success
// @router /namespaces/:namespace/clusters/:cluster [get]
func (c *KubeJobController) ListJobByCronJob() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	cronJob := c.Input().Get("name")
	param := c.BuildKubernetesQueryParam()
	manager := c.Manager(cluster)
	result, err := job.GetRelatedJobByCronJob(manager.KubeClient, namespace, cronJob, param)

	if err != nil {
		logs.Error("Get kubernetes Job by CronJob error.", cluster, namespace, cronJob, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}
