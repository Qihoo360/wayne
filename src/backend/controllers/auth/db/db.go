package db

import (
	"fmt"

	"github.com/Qihoo360/wayne/src/backend/controllers/auth"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/encode"
)

type DBAuth struct{}

func init() {
	auth.Register(models.AuthTypeDB, &DBAuth{})
}

type CurrentInfo struct {
	User   *models.User      `json:"user"`
	Config map[string]string `json:"config"`
}

func (*DBAuth) Authenticate(m models.AuthModel) (*models.User, error) {
	username := m.Username
	password := m.Password
	user, err := models.UserModel.GetUserByName(username)
	if err != nil {
		return nil, err
	}

	if user.Password == "" || user.Salt == "" {
		return nil, fmt.Errorf("user dons't support db login!")
	}

	passwordHashed := encode.EncodePassword(password, user.Salt)

	if passwordHashed != user.Password {
		return nil, fmt.Errorf("username or password error!")
	}
	return user, nil
}
