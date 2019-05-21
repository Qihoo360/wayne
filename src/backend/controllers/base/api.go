package base

import (
	"fmt"
	"net/http"
	"strconv"

	"k8s.io/apiextensions-apiserver/pkg/client/clientset/clientset"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type APIController struct {
	LoggedInController

	NamespaceId int64
	AppId       int64
}

func (c *APIController) Prepare() {
	c.LoggedInController.Prepare()

	namespaceId, _ := strconv.Atoi(c.Ctx.Input.Param(":namespaceid"))
	if namespaceId < 0 {
		c.AbortBadRequest(fmt.Sprintf("namespaceId (%d) can't less than 0.", namespaceId))
	}
	c.NamespaceId = int64(namespaceId)

	appId, _ := strconv.Atoi(c.Ctx.Input.Param(":appid"))
	if appId < 0 {
		c.AbortBadRequest(fmt.Sprintf("appId (%d) can't less than 0.", appId))
	}
	c.AppId = int64(appId)
	if c.NamespaceId == 0 && c.AppId != 0 {
		app, err := models.AppModel.GetById(c.AppId)
		if err != nil {
			logs.Info("Get app by id error.%v", err)
			c.AbortInternalServerError("Get app by id error.")
		}
		c.NamespaceId = app.Namespace.Id
	}
}

func (c *APIController) PreparePermission(methodActionMap map[string]string, method string, permissionType string) {
	action, ok := methodActionMap[method]
	if !ok {
		return
	}
	c.CheckPermission(permissionType, action)
}

/*
 * 检查资源权限
 */
func (c *APIController) CheckPermission(perType string, perAction string) {

	// 如果用户是admin，跳过permission检查
	if c.User.Admin {
		return
	}

	perName := models.PermissionModel.MergeName(perType, perAction)

	if c.NamespaceId != 0 {
		// 检查namespace的操作权限
		_, err := models.NamespaceUserModel.GetOneByPermission(c.NamespaceId, c.User.Id, perName)
		if err == nil {
			return
		}

		if c.AppId != 0 {
			// 检查App的操作权限
			_, err := models.AppUserModel.GetOneByPermission(c.AppId, c.User.Id, perName)
			if err == nil {
				return
			}
			logs.Info("User does not have current app permissions.", c.User.Name, perName, c.AppId, err)
			c.AbortForbidden(fmt.Sprintf("User (%s) does not have current app (%d) permissions (%s).", c.User.Name,
				c.AppId, perName))
		}

		logs.Info("User does not have current namespace permissions.", c.User.Name, perName, c.NamespaceId, err)
		c.AbortForbidden(fmt.Sprintf("User (%s) does not have current namespace (%d) permissions (%s).", c.User.Name,
			c.NamespaceId, perName))

	}

	c.AbortForbidden("Permission error")
}

func (c *APIController) ApiextensionsClient(cluster string) *clientset.Clientset {
	manager, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat(fmt.Sprintf("Get cluster (%s) manager error. %v", cluster, err))
	}
	cli, err := clientset.NewForConfig(manager.Config)
	if err != nil {
		c.AbortBadRequestFormat(fmt.Sprintf("Create (%s) apiextensions client error. %v", cluster, err))
	}
	return cli
}

func (c *APIController) Client(cluster string) *kubernetes.Clientset {
	kubeClient, err := client.Client(cluster)
	if err != nil {
		c.AbortBadRequestFormat(fmt.Sprintf("Get cluster (%s) client error. %v", cluster, err))
	}
	return kubeClient
}

func (c *APIController) Manager(cluster string) *client.ClusterManager {
	kubeManager, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat(fmt.Sprintf("Get cluster (%s) manager error. %v", cluster, err))
	}
	return kubeManager
}

func (c *APIController) KubeClient(cluster string) client.ResourceHandler {
	kubeManager, err := client.Manager(cluster)
	if err != nil {
		c.AbortBadRequestFormat(fmt.Sprintf("Get cluster (%s) manager error. %v", cluster, err))
	}
	return kubeManager.KubeClient
}

func (c *APIController) Success(data interface{}) {
	c.publishRequestMessage(http.StatusOK, data)

	c.ResultHandlerController.Success(data)
}

// Abort stops controller handler and show the error data， e.g. Prepare
func (c *APIController) AbortForbidden(msg string) {
	c.publishRequestMessage(http.StatusForbidden, msg)

	c.ResultHandlerController.AbortForbidden(msg)
}

func (c *APIController) AbortInternalServerError(msg string) {
	c.publishRequestMessage(http.StatusInternalServerError, msg)

	c.ResultHandlerController.AbortInternalServerError(msg)
}

func (c *APIController) AbortBadRequest(msg string) {
	c.publishRequestMessage(http.StatusBadRequest, msg)

	c.ResultHandlerController.AbortBadRequest(msg)
}

func (c *APIController) AbortUnauthorized(msg string) {
	c.publishRequestMessage(http.StatusUnauthorized, msg)

	c.ResultHandlerController.AbortUnauthorized(msg)

}

// Handle return http code and body normally, need return
func (c *APIController) HandleError(err error) {
	code := c.ResultHandlerController.HandleError(err)

	c.publishRequestMessage(code, err)
}
