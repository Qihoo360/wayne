package oauth2

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/astaxie/beego/httplib"
	"golang.org/x/oauth2"
)

var _ OAuther = &OAuth2Qihoo{}

type OAuth2Qihoo struct {
	*oauth2.Config
	ApiUrl string
}

func (o *OAuth2Qihoo) UserInfo(token string) (*BasicUserInfo, error) {
	userinfo := &BasicUserInfo{}

	response, err := httplib.Get(o.ApiUrl).Header("Authorization", fmt.Sprintf("Bearer %s", token)).DoRequest()

	if err != nil {
		return nil, fmt.Errorf("Error getting user info: %s", err)
	}

	result, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(result, userinfo)
	if err != nil {
		return nil, fmt.Errorf("Error Unmarshal user info: %s", err)
	}

	return userinfo, nil
}
