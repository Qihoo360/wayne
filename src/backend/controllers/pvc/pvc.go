package pvc

import (
	"encoding/json"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type PersistentVolumeClaimController struct {
	base.APIController
}

func (c *PersistentVolumeClaimController) URLMapping() {
	c.Mapping("GetNames", c.GetNames)
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Delete", c.Delete)
}

func (c *PersistentVolumeClaimController) Prepare() {
	// Check administration
	c.APIController.Prepare()
	// Check permission
	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Get", "List":
		perAction = models.PermissionRead
	case "Create":
		perAction = models.PermissionCreate
	case "Update":
		perAction = models.PermissionUpdate
	case "Delete":
		perAction = models.PermissionDelete
	}
	if perAction != "" {
		c.CheckPermission(models.PermissionTypePersistentVolumeClaim, perAction)
	}
}

// @Title List/
// @Description get all id and names
// @Param	deleted		query 	bool	false		"is deleted,default false."
// @Success 200 {object} []models.PersistentVolumeClaim success
// @router /names [get]
func (c *PersistentVolumeClaimController) GetNames() {
	filters := make(map[string]interface{})
	deleted := c.GetDeleteFromQuery()
	filters["Deleted"] = deleted
	if c.AppId != 0 {
		filters["App__Id"] = c.AppId
	}

	pvcs, err := models.PersistentVolumeClaimModel.GetNames(filters)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(pvcs)
}

// @Title GetAll
// @Description get all PersistentVolumeClaim
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	name		query 	string	false		"name filter"
// @Param	deleted		query 	bool	false		"is deleted, default list all"
// @Success 200 {object} []models.PersistentVolumeClaim success
// @router / [get]
func (c *PersistentVolumeClaimController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}
	pvc := []models.PersistentVolumeClaim{}

	if c.AppId != 0 {
		param.Query["App__Id"] = c.AppId
	} else if !c.User.Admin {
		param.Query["App__AppUsers__User__Id__exact"] = c.User.Id
		perName := models.PermissionModel.MergeName(models.PermissionTypePersistentVolumeClaim, models.PermissionRead)
		param.Query["App__AppUsers__Group__Permissions__Permission__Name__contains"] = perName
		param.Groupby = []string{"Id"}
	}

	total, err := models.GetTotal(new(models.PersistentVolumeClaim), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.PersistentVolumeClaim), &pvc, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	for key, one := range pvc {
		pvc[key].AppId = one.App.Id
	}

	c.Success(param.NewPage(total, pvc))
	return
}

// @Title Create
// @Description create PersistentVolumeClaim
// @Param	body		body 	models.PersistentVolumeClaim	true		"The PersistentVolumeClaim content"
// @Success 200 return models.PersistentVolumeClaim success
// @router / [post]
func (c *PersistentVolumeClaimController) Create() {
	var pvc models.PersistentVolumeClaim
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &pvc)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("PersistentVolumeClaim")
		return
	}

	pvc.User = c.User.Name
	_, err = models.PersistentVolumeClaimModel.Add(&pvc)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(pvc)
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.PersistentVolumeClaim success
// @router /:id([0-9]+) [get]
func (c *PersistentVolumeClaimController) Get() {
	id := c.GetIDFromURL()

	pvc, err := models.PersistentVolumeClaimModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(pvc)
}

// @Title Update
// @Description update the PersistentVolumeClaim
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.PersistentVolumeClaim	true		"The body"
// @Success 200 models.PersistentVolumeClaim success
// @router /:id [put]
func (c *PersistentVolumeClaimController) Update() {
	id := c.GetIDFromURL()
	var pvc models.PersistentVolumeClaim
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &pvc)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("PersistentVolumeClaim")
		return
	}

	pvc.Id = int64(id)
	err = models.PersistentVolumeClaimModel.UpdateById(&pvc)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(pvc)
}

// @Title UpdateOrders
// @Description batch update the Orders
// @Param	body		body 	[]models.PersistentVolumeClaim	true		"The body"
// @Success 200 models.Deployment success
// @router /updateorders [put]
func (c *PersistentVolumeClaimController) UpdateOrders() {
	var persistentVolumeClaims []*models.PersistentVolumeClaim
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &persistentVolumeClaims)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("persistentVolumeClaims")
	}

	err = models.PersistentVolumeClaimModel.UpdateOrders(persistentVolumeClaims)
	if err != nil {
		logs.Error("update orders (%v) error.%v", persistentVolumeClaims, err)
		c.HandleError(err)
		return
	}
	c.Success("ok!")
}

// @Title Delete
// @Description delete the PersistentVolumeClaim
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *PersistentVolumeClaimController) Delete() {
	id := c.GetIDFromURL()

	logical := c.GetLogicalFromQuery()

	err := models.PersistentVolumeClaimModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
