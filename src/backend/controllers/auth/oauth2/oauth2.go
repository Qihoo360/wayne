package oauth2

import (
	"fmt"

	"golang.org/x/net/context"

	"github.com/Qihoo360/wayne/src/backend/controllers/auth"
	"github.com/Qihoo360/wayne/src/backend/models"
	selfoauth "github.com/Qihoo360/wayne/src/backend/oauth2"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

func init() {
	auth.Register(models.AuthTypeOAuth2, &OAuth2Auth{})
}

type OAuth2Auth struct {
}

func (*OAuth2Auth) Authenticate(m models.AuthModel) (*models.User, error) {
	oauther := selfoauth.OAutherMap[m.OAuth2Name]

	code := m.OAuth2Code

	token, err := oauther.Exchange(context.Background(), code)
	if err != nil {
		logs.Error("oauth2 get token by code (%s) error.%v", code, err)
		return nil, fmt.Errorf("oauth2 get token by code (%s) error.%v", code, err)
	}
	userinfo, err := oauther.UserInfo(token.AccessToken)
	if err != nil {
		logs.Error("oauth2 get user by token (%s) error.%v", token.AccessToken, err)
		return nil, fmt.Errorf("oauth2 get user by token (%s) error.%v", token.AccessToken, err)
	}
	userModel := models.User{
		Name:    userinfo.Name,
		Email:   userinfo.Email,
		Display: userinfo.Display,
	}

	return &userModel, nil
}
