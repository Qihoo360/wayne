package models

import (
	"fmt"
	"time"
)

type APIKeyType int32

const (
	TableNameAPIKey = "api_key"

	GlobalAPIKey      APIKeyType = 0
	NamespaceAPIKey   APIKeyType = 1
	ApplicationAPIKey APIKeyType = 2
)

type apiKeyModel struct{}

type APIKey struct {
	Id    int64  `orm:"auto" json:"id,omitempty"`
	Name  string `orm:"index;size(128)" json:"name,omitempty"`
	Token string `orm:"type(text)" json:"token,omitempty"`
	// 0：全局 1：命名空间 2：项目
	Type       APIKeyType `orm:"type(integer)" json:"type"`
	ResourceId int64      `orm:"null;type(bigint)" json:"resourceId,omitempty"`
	// TODO beego 默认删除规则为级联删除，可选项 do_nothing on_delete
	Group       *Group     `orm:"null;rel(fk);on_delete(set_null)" json:"group,omitempty"`
	Description string     `orm:"null;size(512)" json:"description,omitempty"`
	User        string     `orm:"size(128)" json:"user,omitempty"`
	ExpireIn    int64      `orm:"type(bigint)" json:"expireIn"`            // 过期时间，单位：秒
	Deleted     bool       `orm:"default(false)" json:"deleted,omitempty"` // 是否生效
	CreateTime  *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime  *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
}

func (k *APIKey) String() string {
	return fmt.Sprintf("[APIKey %d] %s", k.Id, k.Name)
}

func (*APIKey) TableName() string {
	return TableNameAPIKey
}

func (*apiKeyModel) Add(m *APIKey) (id int64, err error) {
	id, err = Ormer().Insert(m)
	if err != nil {
		return
	}
	return
}

func (*apiKeyModel) GetById(id int64) (v *APIKey, err error) {
	v = &APIKey{Id: id}

	if err = Ormer().Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

func (*apiKeyModel) GetByToken(token string) (v *APIKey, err error) {
	v = &APIKey{Token: token}

	if err = Ormer().Read(v, "token"); err != nil {
		return
	}
	v.Group, err = GroupModel.GetGroupById(v.Group.Id)

	return
}

func (*apiKeyModel) UpdateById(m *APIKey) (err error) {
	v := APIKey{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.UpdateTime = nil
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*apiKeyModel) DeleteById(id int64, logical bool) (err error) {
	v := APIKey{Id: id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		if logical {
			v.Deleted = true
			_, err = Ormer().Update(&v)
			return err
		}
		_, err = Ormer().Delete(&v)
		return err
	}
	return
}
