package base

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/util/snaker"
)

type ParamBuilderController struct {
	ResultHandlerController
}

func (c *ParamBuilderController) BuildQueryParam() *common.QueryParam {
	no, size := c.buildPageParam()

	qmap := map[string]interface{}{}
	deletedStr := c.Input().Get("deleted")
	if deletedStr != "" {
		deleted, err := strconv.ParseBool(deletedStr)
		if err != nil {
			c.AbortBadRequest("Invalid deleted in query.")
		}
		qmap["deleted"] = deleted
	}

	filter := c.Input().Get("filter")
	if filter != "" {
		filters := strings.Split(filter, ",")
		for _, param := range filters {
			params := strings.Split(param, "=")
			if len(params) != 2 {
				continue
			}
			key, value := params[0], params[1]
			// 兼容在filter中使用deleted参数
			if key == "deleted" {
				deleted, err := strconv.ParseBool(value)
				if err != nil {
					continue
				}
				qmap[key] = deleted
				continue
			}
			qmap[params[0]] = params[1]
		}
	}

	relate := ""
	if c.Input().Get("relate") != "" {
		relate = c.Input().Get("relate")
	}

	return &common.QueryParam{
		PageNo:   no,
		PageSize: size,
		Query:    qmap,
		Sortby:   snaker.CamelToSnake(c.Input().Get("sortby")),
		Relate:   relate}
}

func (c *ParamBuilderController) BuildKubernetesQueryParam() *common.QueryParam {
	no, size := c.buildPageParam()

	qmap := map[string]interface{}{}

	filter := c.Input().Get("filter")
	if filter != "" {
		filters := strings.Split(filter, ",")
		for _, param := range filters {
			params := strings.Split(param, "=")
			if len(params) != 2 {
				continue
			}
			qmap[params[0]] = params[1]
		}
	}

	return &common.QueryParam{
		PageNo:        no,
		PageSize:      size,
		Query:         qmap,
		Sortby:        c.Input().Get("sortby"),
		LabelSelector: c.Input().Get("labelSelector")}
}

func (c *ParamBuilderController) buildPageParam() (no int64, size int64) {
	pageNo := c.Input().Get("pageNo")
	pageSize := c.Input().Get("pageSize")
	if pageNo == "" {
		pageNo = strconv.Itoa(defaultPageNo)
	}

	if pageSize == "" {
		pageSize = strconv.Itoa(defaultPageSize)
	}

	no, err := strconv.ParseInt(pageNo, 10, 64)
	// pageNo must bigger than zero.
	if err != nil || no < 1 {
		c.AbortBadRequest("Invalid pageNo in query.")
	}
	// pageSize must bigger than zero.
	size, err = strconv.ParseInt(pageSize, 10, 64)
	if err != nil || size < 1 {
		c.AbortBadRequest("Invalid pageSize in query.")
	}
	return
}

func (c *ParamBuilderController) GetIDFromURL() int64 {
	return c.GetIntParamFromURL(":id")
}

func (c *ParamBuilderController) GetIntParamFromURL(param string) int64 {
	paramStr := c.Ctx.Input.Param(param)
	if len(paramStr) == 0 {
		c.AbortBadRequest(fmt.Sprintf("Invalid %s in URL", param))
	}

	paramInt, err := strconv.ParseInt(paramStr, 10, 64)
	if err != nil || paramInt < 0 {
		c.AbortBadRequest(fmt.Sprintf("Invalid %s in URL", param))
	}

	return paramInt
}

func (c *ParamBuilderController) GetIntParamFromQuery(param string) int64 {
	paramStr := c.Input().Get(param)
	if len(paramStr) == 0 {
		c.AbortBadRequest(fmt.Sprintf("Invalid %s in Query", param))
	}

	paramInt, err := strconv.ParseInt(paramStr, 10, 64)
	if err != nil || paramInt < 0 {
		c.AbortBadRequest(fmt.Sprintf("Invalid %s in Query", param))
	}

	return paramInt
}

func (c *ParamBuilderController) GetBoolParamFromQuery(param string) bool {
	paramStr := c.Input().Get(param)
	if len(paramStr) == 0 {
		c.AbortBadRequest(fmt.Sprintf("Invalid %s in Query", param))
	}

	paramBool, err := strconv.ParseBool(paramStr)
	if err != nil {
		c.AbortBadRequest(fmt.Sprintf("Invalid %s in Query", param))
	}

	return paramBool
}

func (c *ParamBuilderController) GetBoolParamFromQueryWithDefault(param string, defaultValue bool) bool {
	paramStr := c.Input().Get(param)
	if len(paramStr) == 0 {
		return defaultValue
	}

	paramBool, err := strconv.ParseBool(paramStr)
	if err != nil {
		c.AbortBadRequest(fmt.Sprintf("Invalid %s in Query", param))
	}

	return paramBool
}

func (c *ParamBuilderController) GetDeleteFromQuery() bool {
	return c.GetBoolParamFromQueryWithDefault("deleted", false)
}

func (c *ParamBuilderController) GetLogicalFromQuery() bool {
	return c.GetBoolParamFromQueryWithDefault("logical", true)
}

func (c *ParamBuilderController) GetIsOnlineFromQuery() bool {
	return c.GetBoolParamFromQueryWithDefault("isOnline", false)
}
