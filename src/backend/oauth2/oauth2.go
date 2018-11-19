package oauth2

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/astaxie/beego"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
)

func init() {
	NewOAuth2Service()
}

var (
	OAuth2Infos = make(map[string]*OAuth2Info)
	OAutherMap  = make(map[string]OAuther)
)

const (
	OAuth2TypeQihoo = "qihoo"
)

type BasicUserInfo struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Display string `json:"display"`
}

type OAuth2Info struct {
	ClientId     string
	ClientSecret string
	Scopes       []string
	AuthUrl      string
	TokenUrl     string
	ApiUrl       string // get user info
	Enabled      bool
}

type OAuther interface {
	UserInfo(token string) (*BasicUserInfo, error)

	AuthCodeURL(state string, opts ...oauth2.AuthCodeOption) string
	Exchange(ctx context.Context, code string) (*oauth2.Token, error)
	Client(ctx context.Context, t *oauth2.Token) *http.Client
}

func NewOAuth2Service() {
	allOauthes := []string{OAuth2TypeQihoo}

	for _, name := range allOauthes {
		section, err := beego.AppConfig.GetSection("auth." + name)
		if err != nil {
			logs.Info("can't enable oauth"+name, err)
			continue
		}
		enabled, err := strconv.ParseBool(section["enabled"])
		if err != nil {
			logs.Info("parse enabled oauth error", err)
			continue
		}

		if !enabled {
			continue
		}

		info := &OAuth2Info{
			ClientId:     section["client_id"],
			ClientSecret: section["client_secret"],
			Scopes:       strings.Split(section["scopes"], ","),
			AuthUrl:      section["auth_url"],
			TokenUrl:     section["token_url"],
			ApiUrl:       section["api_url"],
			Enabled:      enabled,
		}

		OAuth2Infos[OAuth2TypeQihoo] = info

		config := oauth2.Config{
			ClientID:     info.ClientId,
			ClientSecret: info.ClientSecret,
			Endpoint: oauth2.Endpoint{
				AuthURL:  info.AuthUrl,
				TokenURL: info.TokenUrl,
			},
			RedirectURL: fmt.Sprintf("%s/login/oauth2/%s", beego.AppConfig.String("RedirectUrl"), name),
			Scopes:      info.Scopes,
		}

		if name == OAuth2TypeQihoo {
			OAutherMap[OAuth2TypeQihoo] = &OAuth2Qihoo{
				Config: &config,
				ApiUrl: info.ApiUrl,
			}
		}

	}
}
