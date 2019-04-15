package oauth2

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/astaxie/beego"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"

	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

func init() {
	NewOAuth2Service()
}

var (
	OAuth2Infos = make(map[string]*OAuth2Info)
	OAutherMap  = make(map[string]OAuther)
)

const (
	OAuth2TypeDefault = "oauth2"
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
	ApiMapping   map[string]string
}

type OAuther interface {
	UserInfo(token string) (*BasicUserInfo, error)

	AuthCodeURL(state string, opts ...oauth2.AuthCodeOption) string
	Exchange(ctx context.Context, code string, opts ...oauth2.AuthCodeOption) (*oauth2.Token, error)
	Client(ctx context.Context, t *oauth2.Token) *http.Client
}

func NewOAuth2Service() {
	allOauthes := []string{OAuth2TypeDefault}

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
		info.ApiMapping = make(map[string]string)
		if section["api_mapping"] != "" {
			for _, km := range strings.Split(section["api_mapping"], ",") {
				arr := strings.Split(km, ":")
				info.ApiMapping[arr[0]] = arr[1]
			}
		}

		OAuth2Infos[OAuth2TypeDefault] = info

		config := oauth2.Config{
			ClientID:     info.ClientId,
			ClientSecret: info.ClientSecret,
			Endpoint: oauth2.Endpoint{
				AuthURL:  info.AuthUrl,
				TokenURL: info.TokenUrl,
			},
			RedirectURL: fmt.Sprintf("%s/login/oauth2/%s", section["redirect_url"], name),
			Scopes:      info.Scopes,
		}

		if name == OAuth2TypeDefault {
			OAutherMap[OAuth2TypeDefault] = &OAuth2Default{
				Config:     &config,
				ApiUrl:     info.ApiUrl,
				ApiMapping: info.ApiMapping,
			}
		}

	}
}
