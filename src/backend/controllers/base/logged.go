package base

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"

	rsakey "github.com/Qihoo360/wayne/src/backend/apikey"
	"github.com/Qihoo360/wayne/src/backend/bus"
	"github.com/Qihoo360/wayne/src/backend/bus/message"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response/errors"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

var (
	PublishRequestMessageMethodFilter = []string{
		"POST",
		"PUT",
		"DELETE",
		"PATCH",
	}
)

type LoggedInController struct {
	ParamBuilderController

	User *models.User
}

func (c *LoggedInController) Prepare() {
	authString := c.Ctx.Input.Header("Authorization")

	kv := strings.Split(authString, " ")
	if len(kv) != 2 || kv[0] != "Bearer" {
		logs.Info("AuthString invalid:", authString)
		c.CustomAbort(http.StatusUnauthorized, "Token invalid!")
	}
	tokenString := kv[1]

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// since we only use the one private key to sign the tokens,
		// we also only use its public counter part to verify
		return rsakey.RsaPublicKey, nil
	})

	errResult := errors.ErrorResult{}
	switch err.(type) {
	case nil: // no error
		if !token.Valid { // but may still be invalid
			errResult.Code = http.StatusUnauthorized
			errResult.Msg = "Token Invalid ! "
		}

	case *jwt.ValidationError: // something was wrong during the validation
		errResult.Code = http.StatusUnauthorized
		errResult.Msg = err.Error()

	default: // something else went wrong
		errResult.Code = http.StatusInternalServerError
		errResult.Msg = err.Error()
	}

	if err != nil {
		c.CustomAbort(errResult.Code, errResult.Msg)
	}

	claim := token.Claims.(jwt.MapClaims)
	aud := claim["aud"].(string)
	c.User, err = models.UserModel.GetUserDetail(aud)
	if err != nil {
		c.CustomAbort(http.StatusInternalServerError, err.Error())
	}
}

func (c *LoggedInController) publishRequestMessage(code int, data interface{}) {
	var requestNeedAudit bool
	for _, m := range PublishRequestMessageMethodFilter {
		if c.Ctx.Request.Method == m {
			requestNeedAudit = true
		}
	}
	if !requestNeedAudit {
		return
	}

	var err error
	controller, method := c.GetControllerAndAction()
	// 由于框架及项目抽象设计的问题，`data`作为interface类型多次传递，从Success/Error函数中传入的`data`可能的类型有：
	//   * string
	//   * nil
	//   * 实现MarshalJSON的任意结构
	var body []byte
	switch val := data.(type) {
	case string:
		body = hack.Slice(val)
	default:
		body, _ = json.Marshal(data)
	}
	messageData, err := json.Marshal(message.RequestMessageData{
		URI:            c.Ctx.Input.URI(),
		Controller:     controller,
		Method:         method,
		User:           c.User.Name,
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
