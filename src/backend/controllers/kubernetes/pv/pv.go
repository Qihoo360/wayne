package pv

import (
	"encoding/json"

	"k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/resources/pv"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type KubePersistentVolumeController struct {
	base.APIController
}

func (c *KubePersistentVolumeController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Get", c.Get)
	c.Mapping("Create", c.Create)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *KubePersistentVolumeController) Prepare() {
	// Check administration
	c.APIController.Prepare()
	methodActionMap := map[string]string{
		"List":   models.PermissionRead,
		"Get":    models.PermissionRead,
		"Create": models.PermissionCreate,
		"Update": models.PermissionUpdate,
		"Delete": models.PermissionDelete,
	}
	_, method := c.GetControllerAndAction()
	c.PreparePermission(methodActionMap, method, models.PermissionTypeKubePersistentVolume)

}

// @Title List pv
// @Description find pv by cluster
// @router /clusters/:cluster [get]
func (c *KubePersistentVolumeController) List() {
	cluster := c.Ctx.Input.Param(":cluster")
	cli := c.Client(cluster)
	result, err := pv.ListPersistentVolume(cli, metaV1.ListOptions{})
	if err != nil {
		logs.Error("list pv by cluster (%s) error.%v", cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title get pv
// @Description find pv by cluster
// @router /:name/clusters/:cluster [get]
func (c *KubePersistentVolumeController) Get() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)

	result, err := pv.GetPersistentVolumeByName(cli, name)
	if err != nil {
		logs.Error("get pv by cluster (%s) name(%s) error.%v", cluster, name, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Create
// @Description create PersistentVolume
// @router /clusters/:cluster [post]
func (c *KubePersistentVolumeController) Create() {
	var pvTpl v1.PersistentVolume
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &pvTpl)
	if err != nil {
		c.AbortBadRequestFormat("PersistentVolume")
	}
	cluster := c.Ctx.Input.Param(":cluster")
	cli := c.Client(cluster)
	result, err := pv.CreatePersistentVolume(cli, &pvTpl)
	if err != nil {
		logs.Error("create pv (%v) by cluster (%s) error.%v", pvTpl, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Update
// @Description update the PersistentVolume
// @router /:name/clusters/:cluster [put]
func (c *KubePersistentVolumeController) Update() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	var pvTpl v1.PersistentVolume
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &pvTpl)
	if err != nil {
		c.AbortBadRequestFormat("PersistentVolume")
	}
	if name != pvTpl.Name {
		c.AbortBadRequestFormat("Name")
	}

	cli := c.Client(cluster)
	result, err := pv.UpdatePersistentVolume(cli, &pvTpl)
	if err != nil {
		logs.Error("update pv (%v) by cluster (%s) error.%v", pvTpl, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success(result)
}

// @Title Delete
// @Description delete the PersistentVolume
// @Success 200 {string} delete success!
// @router /:name/clusters/:cluster [delete]
func (c *KubePersistentVolumeController) Delete() {
	cluster := c.Ctx.Input.Param(":cluster")
	name := c.Ctx.Input.Param(":name")
	cli := c.Client(cluster)
	err := pv.DeletePersistentVolume(cli, name)
	if err != nil {
		logs.Error("delete pv (%s) by cluster (%s) error.%v", name, cluster, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")

}
