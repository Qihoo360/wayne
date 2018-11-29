package base

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/util/snaker"
	"github.com/astaxie/beego/orm"
	"github.com/go-sql-driver/mysql"
	"k8s.io/apimachinery/pkg/api/errors"
)

const (
	defaultPageNo   = 1
	defaultPageSize = 10
)

type Result struct {
	Data interface{} `json:"data"`
}

type ErrorSubCode int

const (
	ErrorSubCodeInsufficientResource = 403001
)

var _ error = &ErrorResult{}

// Error implements the Error interface.
func (e *ErrorResult) Error() string {
	return fmt.Sprintf("code:%d,subCode:%d,msg:%s", e.Code, e.SubCode, e.Msg)
}

type ErrorResult struct {
	// http code
	Code int `json:"code"`
	// The custom code
	SubCode int    `json:"subCode"`
	Msg     string `json:"msg"`
}

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

func (c *APIController) Success(data interface{}) {
	c.publishRequestMessage(http.StatusOK, data)

	c.Ctx.Output.SetStatus(http.StatusOK)
	c.Data["json"] = Result{Data: data}
	c.ServeJSON()
}

// Abort stops controller handler and show the error data， e.g. Prepare
func (c *APIController) AbortForbidden(msg string) {
	c.publishRequestMessage(http.StatusForbidden, msg)

	logs.Info("Abort Forbidden error. %s", msg)
	c.CustomAbort(http.StatusForbidden, hack.String(c.ErrorResult(http.StatusForbidden, msg)))
}

func (c *APIController) AbortInternalServerError(msg string) {
	c.publishRequestMessage(http.StatusInternalServerError, msg)

	logs.Error("Abort InternalServerError error. %s", msg)
	c.CustomAbort(http.StatusInternalServerError, hack.String(c.ErrorResult(http.StatusInternalServerError, msg)))
}

func (c *APIController) AbortBadRequest(msg string) {
	c.publishRequestMessage(http.StatusBadRequest, msg)

	logs.Info("Abort BadRequest error. %s", msg)
	c.CustomAbort(http.StatusBadRequest, hack.String(c.ErrorResult(http.StatusBadRequest, msg)))
}

// format BadRequest with param name.
func (c *APIController) AbortBadRequestFormat(paramName string) {
	msg := fmt.Sprintf("Invalid param %s !", paramName)
	c.AbortBadRequest(msg)
}

func (c *APIController) AbortUnauthorized(msg string) {
	c.publishRequestMessage(http.StatusUnauthorized, msg)

	logs.Info("Abort Unauthorized error. %s", msg)
	c.CustomAbort(http.StatusUnauthorized, hack.String(c.ErrorResult(http.StatusUnauthorized, msg)))

}

func (c *APIController) ErrorResult(code int, msg string) []byte {
	errorResult := ErrorResult{
		Code: code,
		Msg:  msg,
	}
	body, err := json.Marshal(errorResult)
	if err != nil {
		logs.Error("Json Marshal error. %v", err)
		c.CustomAbort(http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
	}
	return body
}

// Handle return http code and body normally, need return
func (c *APIController) HandleError(err error) {
	errorResult := &ErrorResult{
		Code: http.StatusInternalServerError,
	}
	switch e := err.(type) {
	// deal with kubernetes errors
	case errors.APIStatus:
		errorResult.Code = int(e.Status().Code)
		errorResult.SubCode = errorResult.Code
		errorResult.Msg = e.Status().Message
	case *mysql.MySQLError:
		errorResult.Code = http.StatusBadRequest
		errorResult.SubCode = int(e.Number)
		errorResult.Msg = e.Message
	case *ErrorResult:
		errorResult = e
	default:
		if err == orm.ErrNoRows {
			errorResult.Code = http.StatusNotFound
		}
		errorResult.SubCode = errorResult.Code
		errorResult.Msg = http.StatusText(errorResult.Code)
	}

	if errorResult.Code >= http.StatusInternalServerError {
		logs.Error("System error. %v", err)
	} else {
		logs.Info("Info error. %v", err)
	}

	c.Ctx.Output.SetStatus(errorResult.Code)

	body, err := json.Marshal(errorResult)
	if err != nil {
		logs.Error("Json Marshal error. %v", err)
		c.CustomAbort(http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
	}

	c.Ctx.Output.Body(body)

	c.publishRequestMessage(errorResult.Code, err)
}

// TODO: 需要重构成独立的Controller，参考Django的generic views设计
func (c *APIController) BuildQueryParam() *common.QueryParam {
	pageNo := c.Input().Get("pageNo")
	pageSize := c.Input().Get("pageSize")
	if pageNo == "" {
		pageNo = strconv.Itoa(defaultPageNo)
	}

	if pageSize == "" {
		pageSize = strconv.Itoa(defaultPageSize)
	}

	no, err := strconv.ParseInt(pageNo, 10, 64)
	if err != nil {
		c.AbortBadRequest("Invalid pageNo in query.")
	}
	size, err := strconv.ParseInt(pageSize, 10, 64)
	if err != nil {
		c.AbortBadRequest("Invalid pageSize in query.")
	}

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

	return &common.QueryParam{PageNo: no, PageSize: size, Query: qmap, Sortby: snaker.CamelToSnake(c.Input().Get("sortby")), Relate: relate}
}

func (c *APIController) GetIDFromURL() int64 {
	return c.GetIntParamFromURL(":id")
}

func (c *APIController) GetIntParamFromURL(param string) int64 {
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

func (c *APIController) GetIntParamFromQuery(param string) int64 {
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

func (c *APIController) GetBoolParamFromQuery(param string) bool {
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

func (c *APIController) GetBoolParamFromQueryWithDefault(param string, defaultValue bool) bool {
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

func (c *APIController) GetDeleteFromQuery() bool {
	return c.GetBoolParamFromQueryWithDefault("deleted", false)
}

func (c *APIController) GetLogicalFromQuery() bool {
	return c.GetBoolParamFromQueryWithDefault("logical", true)
}

func (c *APIController) GetIsOnlineFromQuery() bool {
	return c.GetBoolParamFromQueryWithDefault("isOnline", false)
}
