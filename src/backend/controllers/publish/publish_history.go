package publish

import (
	"time"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type PublishController struct {
	base.APIController
}

func (c *PublishController) URLMapping() {
	c.Mapping("List", c.List)
}

func (c *PublishController) Prepare() {
	// Check administration
	c.APIController.Prepare()
}

// @Title kubernetes deploy statistics
// @Description kubernetes statistics
// @Param	start_time	query 	string	false		"the statistics start time"
// @Param	end_time	query 	string	false		"the statistics end time"
// @Success 200 {object} node.NodeStatistics success
// @router /statistics [get]
func (c *PublishController) Statistics() {
	startTimeStr := c.Input().Get("start_time")
	startTime, err := time.Parse(time.RFC3339, startTimeStr)
	if err != nil {
		logs.Info("request start time (%s) error.", startTimeStr, err)
		c.AbortBadRequestFormat("start_time")
	}
	endTimeStr := c.Input().Get("end_time")
	endTime, err := time.Parse(time.RFC3339, endTimeStr)
	if err != nil {
		logs.Info("request end time (%s) error.", endTimeStr, err)
		c.AbortBadRequestFormat("end_time")
	}

	result, err := models.PublishHistoryModel.GetDeployCountByDay(startTime, endTime)
	if err != nil {
		logs.Error("get publishhistory by day (%s)(%s) error. %v", startTime, endTimeStr, err)
		c.HandleError(err)
		return
	}

	c.Success(result)
}

// @Title GetAll
// @Description get all PublishHistory
// @Param	pageNo		query 	int	false		"the page current no"
// @Param	pageSize		query 	int	false		"the page size"
// @Param	resourceId		query 	int	true		"the ResourceId id,e.g. deployment id"
// @Param	type		query 	int	true		"the ResourceId type ,	 DEPLOYMENT 0 SERVICE 1 CONFIGMAP 2 SECRET 3"
// @Success 200 {object} []models.PublishHistory success
// @router /histories [get]
func (c *PublishController) List() {
	param := c.BuildQueryParam()

	if c.Input().Get("type") != "" {
		param.Query["Type"] = c.Input().Get("type")
	}
	if c.Input().Get("resourceId") != "" {
		param.Query["ResourceId"] = c.Input().Get("resourceId")
	}

	publishHistories := []models.PublishHistory{}
	total, err := models.GetTotal(new(models.PublishHistory), param)
	if err != nil {
		logs.Error("get total count by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	err = models.GetAll(new(models.PublishHistory), &publishHistories, param)
	if err != nil {
		logs.Error("list by param (%s) error. %v", param, err)
		c.HandleError(err)
		return
	}

	c.Success(param.NewPage(total, publishHistories))
	return
}
