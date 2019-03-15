package base

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/go-sql-driver/mysql"
	"k8s.io/apimachinery/pkg/api/errors"

	erroresult "github.com/Qihoo360/wayne/src/backend/models/response/errors"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type ResultHandlerController struct {
	beego.Controller
}

type Result struct {
	Data interface{} `json:"data"`
}

func (c *ResultHandlerController) Success(data interface{}) {
	c.Ctx.Output.SetStatus(http.StatusOK)
	c.Data["json"] = Result{Data: data}
	c.ServeJSON()
}

// Abort stops controller handler and show the error data， e.g. Prepare
func (c *ResultHandlerController) AbortForbidden(msg string) {
	logs.Info("Abort Forbidden error. %s", msg)
	c.CustomAbort(http.StatusForbidden, hack.String(c.errorResult(http.StatusForbidden, msg)))
}

func (c *ResultHandlerController) AbortInternalServerError(msg string) {
	logs.Error("Abort InternalServerError error. %s", msg)
	c.CustomAbort(http.StatusInternalServerError, hack.String(c.errorResult(http.StatusInternalServerError, msg)))
}

func (c *ResultHandlerController) AbortBadRequest(msg string) {
	logs.Info("Abort BadRequest error. %s", msg)
	c.CustomAbort(http.StatusBadRequest, hack.String(c.errorResult(http.StatusBadRequest, msg)))
}

// format BadRequest with param name.
func (c *ResultHandlerController) AbortBadRequestFormat(paramName string) {
	msg := fmt.Sprintf("Invalid param %s !", paramName)
	c.AbortBadRequest(msg)
}

func (c *ResultHandlerController) AbortUnauthorized(msg string) {
	logs.Info("Abort Unauthorized error. %s", msg)
	c.CustomAbort(http.StatusUnauthorized, hack.String(c.errorResult(http.StatusUnauthorized, msg)))

}

// Handle return http code and body normally, need return
func (c *ResultHandlerController) HandleError(err error) int {
	errorResult := &erroresult.ErrorResult{
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
		// MySQL error Duplicate entry;
		// refer https://dev.mysql.com/doc/refman/5.6/en/error-messages-server.html
		if e.Number == 1062 {
			errorResult.Msg = "Resources already exist! "
		} else {
			errorResult.Msg = e.Message
		}
	case *erroresult.ErrorResult:
		errorResult = e
	default:
		if err == orm.ErrNoRows {
			errorResult.Code = http.StatusNotFound
		}
		errorResult.SubCode = errorResult.Code
		errorResult.Msg = err.Error()
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
	return errorResult.Code
}

func (c *ResultHandlerController) errorResult(code int, msg string) []byte {
	errorResult := erroresult.ErrorResult{
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
