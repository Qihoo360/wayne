package log

import (
	"k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/log"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubeLogController struct {
	base.APIController
}

func (c *KubeLogController) URLMapping() {
	c.Mapping("List", c.List)
}

func (c *KubeLogController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	methodActionMap := map[string]string{
		"List": models.PermissionRead,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubePod)
}

// @Title log
// @Description pod logs
// @Param	tailLines		query 	int 	true		"log tail lines."
// @Param	cluster		path 	string 	true		"cluster name."
// @Param	namespace		path 	string 	true		"namespace name."
// @Param	pod		path 	string 	true		"pod name."
// @Param	container		path 	string 	true		"container name."
// @Success 200 {object} "log text" success
// @router /:pod/containers/:container/namespaces/:namespace/clusters/:cluster [get]
func (c *KubeLogController) List() {
	tailLines := c.GetIntParamFromQuery("tailLines")
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	pod := c.Ctx.Input.Param(":pod")
	container := c.Ctx.Input.Param(":container")
	opt := &v1.PodLogOptions{
		Container: container,
		TailLines: &tailLines,
	}
	cli := c.Client(cluster)

	result, err := log.GetLogsByPod(cli, namespace, pod, opt)
	if err != nil {
		logs.Info("get kubernetes log by pod error.", cluster, namespace, pod, err)
		c.HandleError(err)
		return
	}
	c.Success(hack.String(result))
}
