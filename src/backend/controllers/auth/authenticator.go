package auth

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/astaxie/beego"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/oauth2"

	rsakey "github.com/Qihoo360/wayne/src/backend/apikey"
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/models/response/errors"
	selfoauth "github.com/Qihoo360/wayne/src/backend/oauth2"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

// Authenticator provides interface to authenticate user credentials.
type Authenticator interface {
	// Authenticate ...
	Authenticate(m models.AuthModel) (*models.User, error)
}

var registry = make(map[string]Authenticator)

// Register add different authenticators to registry map.
func Register(name string, authenticator Authenticator) {
	if _, dup := registry[name]; dup {
		logs.Info("authenticator: %s has been registered", name)
		return
	}
	registry[name] = authenticator
}

// AuthController operations for Auth
type AuthController struct {
	beego.Controller
}

// URLMapping ...
func (c *AuthController) URLMapping() {
	c.Mapping("Login", c.Login)
	c.Mapping("Logout", c.Logout)
	c.Mapping("CurrentUser", c.CurrentUser)
}

type LoginResult struct {
	Token string `json:"token"`
}

// type is login type
// name when login type is oauth2 used for oauth2 type
// @router /login/:type/?:name [get,post]
func (c *AuthController) Login() {
	username := c.Input().Get("username")
	password := c.Input().Get("password")
	authType := c.Ctx.Input.Param(":type")
	oauth2Name := c.Ctx.Input.Param(":name")
	next := c.Ctx.Input.Query("next")
	if authType == "" || username == "admin" {
		authType = models.AuthTypeDB
	}
	logs.Info("auth type is", authType)
	authenticator, ok := registry[authType]
	if !ok {
		logs.Warning("auth type (%s) is not supported . ", authType)
		c.Ctx.Output.SetStatus(http.StatusBadRequest)
		c.Ctx.Output.Body(hack.Slice(fmt.Sprintf("auth type (%s) is not supported.", authType)))
		return
	}
	authModel := models.AuthModel{
		Username: username,
		Password: password,
	}

	if authType == models.AuthTypeOAuth2 {
		oauther, ok := selfoauth.OAutherMap[oauth2Name]
		if !ok {
			logs.Warning("oauth2 type (%s) is not supported . ", oauth2Name)
			c.Ctx.Output.SetStatus(http.StatusBadRequest)
			c.Ctx.Output.Body(hack.Slice("oauth2 type is not supported."))
			return
		}
		code := c.Input().Get("code")
		if code == "" {
			c.Ctx.Redirect(http.StatusFound, oauther.AuthCodeURL(next, oauth2.AccessTypeOnline))
			return
		}
		authModel.OAuth2Code = code
		authModel.OAuth2Name = oauth2Name
		state := c.Ctx.Input.Query("state")
		if state != "" {
			next = state
		}

	}

	user, err := authenticator.Authenticate(authModel)
	if err != nil {
		logs.Warning("try to login in with user (%s) error %v. ", authModel.Username, err)
		c.Ctx.Output.SetStatus(http.StatusBadRequest)
		c.Ctx.Output.Body(hack.Slice(fmt.Sprintf("Login failed. %v", err)))
		return
	}

	now := time.Now()
	user.LastIp = c.Ctx.Input.IP()
	user.LastLogin = &now
	user, err = models.UserModel.EnsureUser(user)
	if err != nil {
		c.Ctx.Output.SetStatus(http.StatusInternalServerError)
		c.Ctx.Output.Body(hack.Slice(err.Error()))
		return
	}

	// default token exp time is 3600s.
	expSecond := beego.AppConfig.DefaultInt64("TokenLifeTime", 86400)
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		// 签发者
		"iss": "wayne",
		// 签发时间
		"iat": now.Unix(),
		"exp": now.Add(time.Duration(expSecond) * time.Second).Unix(),
		"aud": user.Name,
	})

	apiToken, err := token.SignedString(rsakey.RsaPrivateKey)
	if err != nil {
		logs.Error("create token form rsa private key  error.", rsakey.RsaPrivateKey, err.Error())
		c.Ctx.Output.SetStatus(http.StatusInternalServerError)
		c.Ctx.Output.Body(hack.Slice(err.Error()))
		return
	}

	if next != "" {
		// if oauth type is oauth, set token for client.
		if authType == models.AuthTypeOAuth2 {
			next = next + "&sid=" + apiToken
		}
		c.Redirect(next, http.StatusFound)
		return
	}

	loginResult := LoginResult{
		Token: apiToken,
	}
	c.Data["json"] = base.Result{Data: loginResult}
	c.ServeJSON()
}

// @router /logout [get]
func (c *AuthController) Logout() {

}

// @router /currentuser [get]
func (c *AuthController) CurrentUser() {
	c.Controller.Prepare()
	authString := c.Ctx.Input.Header("Authorization")

	kv := strings.Split(authString, " ")
	if len(kv) != 2 || kv[0] != "Bearer" {
		logs.Error("AuthString invalid:", authString)
		c.CustomAbort(http.StatusUnauthorized, "Token Invalid ! ")
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
	user, err := models.UserModel.GetUserDetail(aud)
	if err != nil {
		c.CustomAbort(http.StatusInternalServerError, err.Error())
	}

	c.Data["json"] = base.Result{Data: user}
	c.ServeJSON()
}
