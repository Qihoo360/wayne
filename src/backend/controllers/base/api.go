package base

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/astaxie/beego/orm"
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

/*
 * 检查资源权限
 */
func (c *APIController) CheckPermission(perType string, perAction string) {

	// 如果用户是admin，跳过permission检查
	if c.User.Admin {
		return
	}

	perName := models.PermissionModel.MergeName(perType, perAction)
	if c.AppId != 0 {
		// 检查App的操作权限
		_, err := models.AppUserModel.GetOneByPermission(c.AppId, c.User.Id, perName)
		if err == nil {
			return
		} else if err != nil && err != orm.ErrNoRows {
			logs.Info("Check app permission error.%v", err)
			c.AbortInternalServerError("Check app permission error.")
		}
	}

	if c.NamespaceId != 0 {
		// 检查namespace的操作权限
		_, err := models.NamespaceUserModel.GetOneByPermission(c.NamespaceId, c.User.Id, perName)
		if err == nil {
			return
		} else {
			logs.Info("Check namespace permission error.%v", err)
			c.AbortInternalServerError("Check namespace permission error.")
		}
	}

	c.AbortForbidden("Permission error")
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
