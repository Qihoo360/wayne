package base

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"

	"github.com/Qihoo360/wayne/src/backend/bus"
	"github.com/Qihoo360/wayne/src/backend/bus/message"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
)

type APIKeyController struct {
	beego.Controller

	APIKey  *models.APIKey
	Action  string
	Success response.Success
	Failure response.Failure
}

/**
 * 通过 apikey 参数判断调用权限
 * apikey 类型：全局apikey（管理员可用）、命名空间级别的 apikey 和项目级别的 apikey（app 内部可用）
 **/
func (c *APIKeyController) Prepare() {
	c.Controller.Prepare()

	token := c.GetString("apikey")
	if token == "" {
		c.AddErrorAndResponse("No parameter named apikey in url query!", http.StatusForbidden)
		return
	}
	key, err := models.ApiKeyModel.GetByToken(token)
	// TODO 考虑统一处理 DB 错误
	if err == orm.ErrNoRows {
		c.AddErrorAndResponse("Invalid apikey parameter!", http.StatusForbidden)
		return
	} else if err != nil {
		c.AddErrorAndResponse("DB Connection Error!", http.StatusInternalServerError)
		return
	}
	if key.Deleted {
		c.AddErrorAndResponse("Invalid apikey parameter: deleted!", http.StatusForbidden)
		return
	}
	if key.ExpireIn != 0 && time.Now().After(key.CreateTime.Add(time.Second*time.Duration(key.ExpireIn))) {
		c.AddErrorAndResponse("Invalid apikey parameter: out of date!", http.StatusForbidden)
		return
	}
	_, c.Action = c.GetControllerAndAction()
	c.APIKey = key
}

func (c *APIKeyController) publishRequestMessage(code int, data interface{}) {
	var err error
	controller, _ := c.GetControllerAndAction()
	var body []byte
	switch val := data.(type) {
	case string:
		body = hack.Slice(val)
	default:
		body, _ = json.Marshal(data)
	}
	u := "[APIKey]"
	if c.APIKey != nil {
		u = c.APIKey.String()
	}
	messageData, err := json.Marshal(message.RequestMessageData{
		URI:            c.Ctx.Input.URI(),
		Controller:     controller,
		Method:         c.Action,
		User:           u,
		IP:             c.Ctx.Input.IP(),
		ResponseStatus: code,
		ResponseBody:   body,
	})
	if err != nil {
		logs.Error(err)
	} else {
		msg := message.Message{
			Type: message.TypeRequest,
			Data: json.RawMessage(messageData),
		}
		if err := bus.Notify(msg); err != nil {
			logs.Error(err)
		}
	}
}

// 用于负责 get 数据的接口，当 error 列表不为空的时候，返回 error 列表
// 当 参数为 nil 的时候，返回 "200"
func (c *APIKeyController) HandleResponse(data interface{}) {
	if len(c.Failure.Body.Errors) > 0 {
		c.Failure.Body.Code = http.StatusInternalServerError
		c.HandleByCode(http.StatusInternalServerError)
		return
	}
	if data == nil {
		c.Success.Body.Code = http.StatusOK
		data = c.Success.Body
	}
	c.publishRequestMessage(http.StatusOK, data)
	c.Ctx.Output.SetStatus(http.StatusOK)
	c.Data["json"] = data
	c.ServeJSON()
}

func (c *APIKeyController) HandleByCode(code int) {
	c.Ctx.Output.SetStatus(code)
	// gateway 处验证不通过的状态码为 403
	if code < 400 {
		c.Success.Body.Code = code
		c.publishRequestMessage(code, c.Success)
		c.Data["json"] = c.Success.Body

	} else {
		c.Failure.Body.Code = code
		c.publishRequestMessage(code, c.Failure)
		c.Data["json"] = c.Failure.Body
	}
	c.ServeJSON()
}

func (c *APIKeyController) AddError(err string) {
	c.Failure.Body.Errors = append(c.Failure.Body.Errors, err)
}

func (c *APIKeyController) AddErrorAndResponse(err string, code int) {
	if code < 400 {
		panic("Not Error Code!")
	}
	if len(err) == 0 {
		err = http.StatusText(code)
	}
	c.AddError(err)
	c.HandleByCode(code)
	panic(err)
}
