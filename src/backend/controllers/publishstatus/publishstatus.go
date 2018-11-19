package publishstatus

import (
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type PublishStatusController struct {
	base.APIController
}

func (c *PublishStatusController) URLMapping() {
	c.Mapping("List", c.List)
	c.Mapping("Delete", c.Delete)
}

func (c *PublishStatusController) Prepare() {
	// Check administration
	c.APIController.Prepare()
}

// @Title GetAll
// @Description get all PublishStatus
// @Param	resourceId		query 	int	true		"the ResourceId id,e.g. deployment id"
// @Param	type		query 	int	true		"the ResourceId type ,	 DEPLOYMENT 0 SERVICE 1 CONFIGMAP 2 SECRET 3"
// @Success 200 {object} []models.PublishStatus success
// @router / [get]
func (c *PublishStatusController) List() {
	resourceType := c.GetIntParamFromQuery("type")
	resourceId := c.GetIntParamFromQuery("resourceId")

	status, err := models.PublishStatusModel.GetAll(models.PublishType(resourceType), int64(resourceId))
	if err != nil {
		logs.Error("get all PublishStatus %v", err)
		c.HandleError(err)
		return
	}
	c.Success(status)
}

// @Title Delete
// @Description delete the publishstatus
// @Param	id		path 	int	true		"The id you want to delete"
// @Success 200 {string} delete success!
// @router /:id [delete]
func (c *PublishStatusController) Delete() {
	id := c.GetIDFromURL()

	err := models.PublishStatusModel.DeleteById(int64(id))
	if err != nil {
		logs.Error("delete %d error.%v", id, err)
		c.HandleError(err)
		return
	}
	c.Success(nil)
}
