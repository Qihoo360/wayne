package oauth2

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/astaxie/beego/httplib"
	"golang.org/x/oauth2"
)

var _ OAuther = &OAuth2Default{}

type OAuth2Default struct {
	*oauth2.Config
	ApiUrl     string
	ApiMapping map[string]string
}

func (o *OAuth2Default) UserInfo(token string) (*BasicUserInfo, error) {
	userinfo := &BasicUserInfo{}

	response, err := httplib.Get(o.ApiUrl).Header("Authorization", fmt.Sprintf("Bearer %s", token)).DoRequest()

	if err != nil {
		return nil, fmt.Errorf("Error getting user info: %s", err)
	}

	result, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	if len(o.ApiMapping) == 0 {
		err = json.Unmarshal(result, userinfo)
		if err != nil {
			return nil, fmt.Errorf("Error Unmarshal user info: %s", err)
		}
	} else {
		usermap := make(map[string]interface{})
		if err := json.Unmarshal(result, &usermap); err != nil {
			return nil, fmt.Errorf("Error Unmarshal user info: %s", err)
		}
		if usermap[o.ApiMapping["name"]] != nil {
			userinfo.Name = usermap[o.ApiMapping["name"]].(string)
		}
		if usermap[o.ApiMapping["email"]] != nil {
			userinfo.Email = usermap[o.ApiMapping["email"]].(string)
		}
		if usermap[o.ApiMapping["display"]] != nil {
			userinfo.Display = usermap[o.ApiMapping["display"]].(string)
		}
	}

	return userinfo, nil
}
