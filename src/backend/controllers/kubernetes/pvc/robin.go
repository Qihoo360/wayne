package pvc

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"

	"github.com/astaxie/beego/httplib"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/pvc"
	"github.com/Qihoo360/wayne/src/backend/util/des"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
)

type RobinPersistentVolumeClaimController struct {
	base.APIController
}

func (c *RobinPersistentVolumeClaimController) URLMapping() {
	c.Mapping("GetPvcStatus", c.GetPvcStatus)
	c.Mapping("ActiveImage", c.ActiveImage)
	c.Mapping("InActiveImage", c.InActiveImage)
	c.Mapping("OfflineImageUser", c.OfflineImageUser)
	c.Mapping("LoginInfo", c.LoginInfo)
	c.Mapping("Verify", c.Verify)
	c.Mapping("ListSnapshot", c.ListSnapshot)
	c.Mapping("CreateSnapshot", c.CreateSnapshot)
	c.Mapping("DeleteAllSnapshot", c.DeleteAllSnapshot)
	c.Mapping("DeleteSnapshot", c.DeleteSnapshot)
	c.Mapping("RollbackSnapshot", c.RollbackSnapshot)
}

func (c *RobinPersistentVolumeClaimController) Prepare() {
	// Check administration
	c.APIController.Prepare()

	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Get":
		perAction = models.PermissionRead
	case "Deploy":
		perAction = models.PermissionDeploy
	case "Delete":
		perAction = models.PermissionDelete
	}
	if perAction != "" {
		c.CheckPermission(models.PermissionTypePersistentVolumeClaim, perAction)
	}
}

// @Title Get pvc status
// @Description find PersistentVolumeClaim by cluster
// @router /:pvc/status/namespaces/:namespace/clusters/:cluster [get]
func (c *RobinPersistentVolumeClaimController) GetPvcStatus() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")
	cli, err := client.Client(cluster)
	if err == nil {
		image, imageType, err := pvc.GetImageNameAndTypeByPvc(cli, name, namespace)
		if err != nil {
			c.HandleError(err)
			return
		}
		status := struct {
			Status    []string `json:"status"`
			RbdImage  string   `json:"rbdImage"`
			ImageType string   `json:"imageType"`
		}{RbdImage: image, ImageType: imageType}

		robinMetaData, err := clusterRobinMetaData(cluster)
		if err != nil {
			c.HandleError(err)
			return
		}

		err = doRobinRequestDeserialization(httplib.Get(fmt.Sprintf("%s/v1/device/%s/status?type=%s",
			robinMetaData.Url,
			image,
			imageType)), &status, robinMetaData.Token)
		if err != nil {
			c.HandleError(err)
			return
		}
		c.Success(status)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

func clusterRobinMetaData(cluster string) (*models.ClusterRobinMetaData, error) {
	metaData, err := models.ClusterModel.ClusterMetaData(cluster)
	if err != nil {
		return nil, err
	}
	if metaData.Robin == nil {
		return nil, errors.New("No Robin metaData configured! ")
	}

	if metaData.Robin.Url == "" {
		return nil, errors.New("Robin url is null. ")
	}

	if metaData.Robin.Token == "" {
		return nil, errors.New("Robin token is null. ")
	}

	return metaData.Robin, nil
}

// @Title Active Image
// @Description active rbd images
// @router /:pvc/rbd/namespaces/:namespace/clusters/:cluster [post]
func (c *RobinPersistentVolumeClaimController) ActiveImage() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")

	cli, err := client.Client(cluster)
	if err == nil {
		image, imageType, err := pvc.GetImageNameAndTypeByPvc(cli, name, namespace)
		if err != nil {
			c.HandleError(err)
			return
		}
		robinMetaData, err := clusterRobinMetaData(cluster)
		if err != nil {
			c.HandleError(err)
			return
		}

		password, err := des.DesEncrypt(hack.Slice(name), hack.Slice(robinMetaData.PasswordDesKey))
		if err != nil {
			c.HandleError(err)
			return
		}

		activeUser := struct {
			User     string `json:"user"`
			Password string `json:"password"`
		}{
			User:     name,
			Password: base64.StdEncoding.EncodeToString(password),
		}
		body, _ := json.Marshal(&activeUser)

		result, err := doRobinRequest(
			httplib.Put(
				fmt.Sprintf(
					"%s/v1/device/%s?type=%s",
					robinMetaData.Url,
					image,
					imageType)).Body(body), robinMetaData.Token)
		if err != nil {
			c.HandleError(err)
			return
		}

		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title InActive Image
// @Description inActive rbd images
// @router /:pvc/rbd/namespaces/:namespace/clusters/:cluster [delete]
func (c *RobinPersistentVolumeClaimController) InActiveImage() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")

	cli, err := client.Client(cluster)
	if err == nil {
		image, imageType, err := pvc.GetImageNameAndTypeByPvc(cli, name, namespace)
		if err != nil {
			c.HandleError(err)
			return
		}

		robinMetaData, err := clusterRobinMetaData(cluster)
		if err != nil {
			c.HandleError(err)
			return
		}

		result, err := doRobinRequest(httplib.Delete(
			fmt.Sprintf(
				"%s/v1/device/%s?type=%s",
				robinMetaData.Url,
				image,
				imageType)), robinMetaData.Token)
		if err != nil {
			c.HandleError(err)
			return
		}

		c.Success(result)
	} else {
		c.AbortBadRequestFormat("Cluster")
	}

}

// @Title offline image user
// @Description offline image user
// @router /:pvc/user/namespaces/:namespace/clusters/:cluster [delete]
func (c *RobinPersistentVolumeClaimController) OfflineImageUser() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")

	cli, err := client.Client(cluster)
	if err == nil {
		image, imageType, err := pvc.GetImageNameAndTypeByPvc(cli, name, namespace)
		if err != nil {
			c.HandleError(err)
			return
		}
		robinMetaData, err := clusterRobinMetaData(cluster)
		if err != nil {
			c.HandleError(err)
			return
		}

		result, err := doRobinRequest(
			httplib.Delete(fmt.Sprintf(
				"%s/v1/device/%s/user?type=%s",
				robinMetaData.Url,
				image,
				imageType)), robinMetaData.Token)
		if err != nil {
			c.HandleError(err)
			return
		}

		c.Success(result)

	} else {
		c.AbortBadRequestFormat("Cluster")
	}

}

// @Title get user info
// @Description get user info
// @router /:pvc/user/namespaces/:namespace/clusters/:cluster [get]
func (c *RobinPersistentVolumeClaimController) LoginInfo() {
	name := c.Ctx.Input.Param(":pvc")

	cluster := c.Ctx.Input.Param(":cluster")

	robinMetaData, err := clusterRobinMetaData(cluster)
	if err != nil {
		c.HandleError(err)
		return
	}

	password, err := des.DesEncrypt(hack.Slice(name), hack.Slice(robinMetaData.PasswordDesKey))
	if err != nil {
		c.HandleError(err)
		return
	}

	robinServer, err := url.Parse(robinMetaData.Url)
	if err != nil {
		c.HandleError(err)
		return
	}

	activeUser := struct {
		User     string `json:"user"`
		Password string `json:"password"`
		Server   string `json:"server,omitempty"`
		Port     int    `json:"port,omitempty"`
	}{
		User:     name,
		Password: base64.StdEncoding.EncodeToString(password),
		Server:   robinServer.Hostname(),
		Port:     robinMetaData.SftpPort,
	}

	c.Success(activeUser)
}

// @Title verify file
// @Description verify file
// @router /:pvc/verify/namespaces/:namespace/clusters/:cluster [get]
func (c *RobinPersistentVolumeClaimController) Verify() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")

	cli, err := client.Client(cluster)
	if err == nil {
		image, imageType, err := pvc.GetImageNameAndTypeByPvc(cli, name, namespace)
		if err != nil {
			c.HandleError(err)
			return
		}
		robinMetaData, err := clusterRobinMetaData(cluster)
		if err != nil {
			c.HandleError(err)
			return
		}

		result, err := doRobinRequest(
			httplib.Get(fmt.Sprintf(
				"%s/v1/device/%s/verify?type=%s",
				robinMetaData.Url,
				image,
				imageType)), robinMetaData.Token)
		if err != nil {
			c.HandleError(err)
			return
		}

		c.Success(result)

	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

func doRobinRequestDeserialization(request *httplib.BeegoHTTPRequest, obj interface{}, token string) error {
	resp, err := request.Header("token", token).
		DoRequest()
	if err != nil {
		return err
	}
	result, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		return errors.New(hack.String(result))
	}

	err = json.Unmarshal(result, &obj)
	if err != nil {
		return err
	}

	return nil
}

func doRobinRequest(request *httplib.BeegoHTTPRequest, token string) (interface{}, error) {
	resp, err := request.Header("token", token).
		DoRequest()
	if err != nil {
		return nil, err
	}
	result, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New(hack.String(result))
	}

	var obj interface{}

	err = json.Unmarshal(result, &obj)
	if err != nil {
		return nil, err
	}

	return obj, nil
}

// @Title list snapshot
// @Description list snapshot
// @router /:pvc/snapshot/namespaces/:namespace/clusters/:cluster [get]
func (c *RobinPersistentVolumeClaimController) ListSnapshot() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")

	cli, err := client.Client(cluster)
	if err == nil {
		image, err := pvc.GetRbdImageByPvc(cli, name, namespace)
		if err != nil {
			c.HandleError(err)
			return
		}
		robinMetaData, err := clusterRobinMetaData(cluster)
		if err != nil {
			c.HandleError(err)
			return
		}

		result, err := doRobinRequest(
			httplib.Get(fmt.Sprintf(
				"%s/v1/snaps/%s",
				robinMetaData.Url,
				image)), robinMetaData.Token)
		if err != nil {
			c.HandleError(err)
			return
		}

		c.Success(result)

	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title create snapshot
// @Description create snapshot
// @router /:pvc/snapshot/:version/namespaces/:namespace/clusters/:cluster [post]
func (c *RobinPersistentVolumeClaimController) CreateSnapshot() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")
	version := c.Ctx.Input.Param(":version")

	cli, err := client.Client(cluster)
	if err == nil {
		image, err := pvc.GetRbdImageByPvc(cli, name, namespace)
		if err != nil {
			c.HandleError(err)
			return
		}
		robinMetaData, err := clusterRobinMetaData(cluster)
		if err != nil {
			c.HandleError(err)
			return
		}

		result, err := doRobinRequest(
			httplib.Put(fmt.Sprintf(
				"%s/v1/snap/%s/%s",
				robinMetaData.Url,
				image,
				version)), robinMetaData.Token)
		if err != nil {
			c.HandleError(err)
			return
		}

		c.Success(result)

	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title delete all snapshot
// @Description delete all snapshot
// @router /:pvc/snapshot/namespaces/:namespace/clusters/:cluster [delete]
func (c *RobinPersistentVolumeClaimController) DeleteAllSnapshot() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")

	cli, err := client.Client(cluster)
	if err == nil {
		image, err := pvc.GetRbdImageByPvc(cli, name, namespace)
		if err != nil {
			c.HandleError(err)
			return
		}
		robinMetaData, err := clusterRobinMetaData(cluster)
		if err != nil {
			c.HandleError(err)
			return
		}

		result, err := doRobinRequest(
			httplib.Delete(fmt.Sprintf(
				"%s/v1/snaps/%s",
				robinMetaData.Url,
				image)), robinMetaData.Token)
		if err != nil {
			c.HandleError(err)
			return
		}

		c.Success(result)

	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title delete snapshot
// @Description delete snapshot
// @router /:pvc/snapshot/:version/namespaces/:namespace/clusters/:cluster [delete]
func (c *RobinPersistentVolumeClaimController) DeleteSnapshot() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")
	version := c.Ctx.Input.Param(":version")

	cli, err := client.Client(cluster)
	if err == nil {
		image, err := pvc.GetRbdImageByPvc(cli, name, namespace)
		if err != nil {
			c.HandleError(err)
			return
		}
		robinMetaData, err := clusterRobinMetaData(cluster)
		if err != nil {
			c.HandleError(err)
			return
		}

		result, err := doRobinRequest(
			httplib.Delete(fmt.Sprintf(
				"%s/v1/snap/%s/%s",
				robinMetaData.Url,
				image,
				version)), robinMetaData.Token)
		if err != nil {
			c.HandleError(err)
			return
		}

		c.Success(result)

	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}

// @Title rollback to snapshot version
// @Description rollback to snapshot version
// @router /:pvc/snapshot/:version/namespaces/:namespace/clusters/:cluster [put]
func (c *RobinPersistentVolumeClaimController) RollbackSnapshot() {
	cluster := c.Ctx.Input.Param(":cluster")
	namespace := c.Ctx.Input.Param(":namespace")
	name := c.Ctx.Input.Param(":pvc")
	version := c.Ctx.Input.Param(":version")

	cli, err := client.Client(cluster)
	if err == nil {
		image, err := pvc.GetRbdImageByPvc(cli, name, namespace)
		if err != nil {
			c.HandleError(err)
			return
		}
		robinMetaData, err := clusterRobinMetaData(cluster)
		if err != nil {
			c.HandleError(err)
			return
		}

		result, err := doRobinRequest(
			httplib.Post(fmt.Sprintf(
				"%s/v1/snap/%s/%s",
				robinMetaData.Url,
				image,
				version)), robinMetaData.Token)
		if err != nil {
			c.HandleError(err)
			return
		}

		c.Success(result)

	} else {
		c.AbortBadRequestFormat("Cluster")
	}
}
