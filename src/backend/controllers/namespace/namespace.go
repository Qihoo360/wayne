package namespace

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type NamespaceController struct {
	base.APIController
}

func (c *NamespaceController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Create", c.Create)
	c.Mapping("Get", c.Get)
	c.Mapping("Update", c.Update)
	c.Mapping("Migrate", c.Migrate)
	c.Mapping("Delete", c.Delete)
	c.Mapping("InitDefault", c.InitDefault)
	c.Mapping("GetHistory", c.History)
}

func (c *NamespaceController) Prepare() {
	// Check administration
	c.APIController.Prepare()
	// Check permission
	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "Get", "List", "GetNames", "GetHistory":
		perAction = models.PermissionRead
	case "Create":
		perAction = models.PermissionCreate
	case "Update", "Migrate":
		perAction = models.PermissionUpdate
	case "Delete":
		perAction = models.PermissionDelete
	}
	if perAction != "" && !c.User.Admin {
		c.AbortForbidden("operation need admin permission.")
	}
}

// @Title List/
// @Description get all id and names
// @Param	deleted		query 	bool	false		"is deleted,default false."
// @Success 200 {object} []models.Namespace success
// @router /names [get]
func (c *NamespaceController) GetNames() {
	deleted := c.GetDeleteFromQuery()

	namespaces, err := models.NamespaceModel.GetNames(deleted)
	if err != nil {
		logs.Error("get names error. %v, delete-status %v", err, deleted)
		c.HandleError(err)
		return
	}

	c.Success(namespaces)
}

// @Title GetAll
// @Description get all namespaces
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	deleted		query 	bool	false		"is deleted"
// @Success 200 {object} []models.Namespace success
// @router / [get]
func (c *NamespaceController) List() {
	param := c.BuildQueryParam()
	name := c.Input().Get("name")
	if name != "" {
		param.Query["name__contains"] = name
	}

	total, err := models.GetTotal(new(models.Namespace), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}
	namespaces := []models.Namespace{}

	err = models.GetAll(new(models.Namespace), &namespaces, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	c.Success(param.NewPage(total, namespaces))
	return
}

// @Title Create
// @Description create namespace
// @Param	body		body 	models.Namespace	true		"The namespace content"
// @Success 200 return models.Namespace success
// @router / [post]
func (c *NamespaceController) Create() {
	var ns models.Namespace
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &ns)
	if err != nil {
		logs.Error("get body error. %v", err)
		c.AbortBadRequestFormat("Namespace")
	}
	ns.User = c.User.Name
	_, err = models.NamespaceModel.Add(&ns)

	if err != nil {
		logs.Error("create error.%v", err.Error())
		c.HandleError(err)
		return
	}
	c.Success(ns)
}

// @Title Get
// @Description init default namespace
// @router /init
func (c *NamespaceController) InitDefault() {
	if c.User.Admin == true {
		err := models.NamespaceModel.InitNamespace()
		if err != nil {
			logs.Error("init namespace fail. %v", err)
			c.HandleError(err)
			return
		}
	} else {
		logs.Error("user not admin %v", c.User)
		c.AbortForbidden("Only admin can init.")
	}
	namespaces := []models.Namespace{}
	c.Success(namespaces)
	return
}

// @Title Get
// @Description find Object by id
// @Param	id		path 	int	true		"the id you want to get"
// @Success 200 {object} models.Namespace success
// @router /:id([0-9]+) [get]
func (c *NamespaceController) Get() {
	id := c.GetIDFromURL()

	ns, err := models.NamespaceModel.GetById(int64(id))
	if err != nil {
		logs.Error("get by id (%d) error.%v", id, err)
		c.HandleError(err)
		return
	}

	c.Success(ns)
	return
}

// @Title Update
// @Description update the namespace
// @Param	id		path 	int	true		"The id you want to update"
// @Param	body		body 	models.Namespace	true		"The body"
// @Success 200 models.Namespace success
// @router /:id [put]
func (c *NamespaceController) Update() {
	id := c.GetIDFromURL()
	var ns models.Namespace
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &ns)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("Namespace")
	}
	ns.Id = int64(id)
	err = models.NamespaceModel.UpdateById(&ns)
	if err != nil {
		logs.Error("update error.%v", err)
		c.HandleError(err)
		return
	}
	c.Success(ns)
}

// @Title Delete
// @Description delete the Namespace
// @Param	id		path 	int	true		"The id you want to delete"
// @Param	logical		query 	bool	false		"is logical deletion,default true"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *NamespaceController) Delete() {
	id := c.GetIDFromURL()
	logical := c.GetLogicalFromQuery()

	err := models.NamespaceModel.DeleteById(int64(id), logical)
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}

// @Title Get Publish History
// @Description get publish history by namespace
// @Param	id     path 	int	true		"The id you want to get publish history"
// @router /:id/history [get]
func (c *NamespaceController) History() {
	id := c.GetIDFromURL()
	dc, err := models.PublishHistoryModel.GetDeployCountGroupByDayFromNamespace(id, time.Now().Add(-time.Hour*24*90))
	if err != nil {
		c.HandleError(err)
		return
	}
	c.Success(dc)
}

// @Title Resource Count
// @Description The app resource count statistics
// @Success 200 {object} models.AppCount success
// @router /:id([0-9]+)/statistics [get]
func (c *NamespaceController) Statistics() {
	namespaceId := c.GetIDFromURL()
	appId, _ := strconv.ParseInt(c.Input().Get("app_id"), 10, 64)
	param := &common.QueryParam{
		Query: map[string]interface{}{
			"deleted":            false,
			"App__Namespace__Id": namespaceId,
		},
	}
	if appId != 0 {
		param.Query["App__Id"] = appId
	}
	resources := []string{
		models.TableNameDeployment,
		models.TableNameStatefulset,
		models.TableNameDaemonSet,
		models.TableNameCronjob,
		models.TableNameService,
		models.TableNameConfigMap,
		models.TableNameSecret,
		models.TableNamePersistentVolumeClaim,
	}

	var result = make(map[string]int64, 0)

	for _, resource := range resources {
		count, err := models.GetTotal(resource, param)
		if err != nil {
			logs.Error("get %s total error. %v", resource, err)
			c.HandleError(err)
			return
		}
		kubeApiType := models.TableToKubeApiTypeMap[resource]
		result[string(kubeApiType)] = count
	}

	c.Success(result)
}

// @Title Migrate
// @Description migrate the namespace from a to b
// @Param	body		body 	models.NamespaceMigration	true	"The namespace migration content"
// @router /migration [post]
func (c *NamespaceController) Migrate() {
	var nm models.NamespaceMigration
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &nm)
	if err != nil {
		logs.Error("Invalid param body.%v", err)
		c.AbortBadRequestFormat("NamespaceMigration")
	}

	_, err = models.NamespaceModel.GetById(nm.SourceId)
	if err != nil {
		logs.Error("Invalid param NamespaceMigration.sourceId:%v", nm.SourceId)
		c.AbortBadRequestFormat("NamespaceMigration.sourceId")
	}

	_, err = models.NamespaceModel.GetById(nm.TargetId)
	if err != nil {
		logs.Error("Invalid param NamespaceMigration.targetId:%v", nm.TargetId)
		c.AbortBadRequestFormat("NamespaceMigration.targetId")
	}


	// TODO 使用事务而不是分开更新
	err = models.AppModel.UpdateByNamespaceId(nm.SourceId, nm.TargetId)
	if err != nil{
		logs.Error("Error when updates app nsId. %v", err)
		c.AbortInternalServerError("update app db error!")
	}


	err = models.NamespaceUserModel.UpdateByNamespaceId(nm.SourceId, nm.TargetId)
	if err != nil{
		logs.Error("Error when updates nsUser nsId. %v", err)
		c.AbortInternalServerError("update nsUser db error!")
	}

	c.Success("successfully migrated namespace")
}
