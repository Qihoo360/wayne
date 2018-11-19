package models

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
)

const (
	TableNameSecret = "secret"
)

type secretModel struct{}

type Secret struct {
	Id          int64  `orm:"auto" json:"id,omitempty"`
	Name        string `orm:"unique;index;size(128)" json:"name,omitempty"`
	MetaData    string `orm:"type(text)" json:"metaData,omitempty"`
	App         *App   `orm:"index;rel(fk)" json:"app,omitempty"`
	Description string `orm:"null;size(512)" json:"description,omitempty"`
	OrderId     int64  `orm:"index;default(0)" json:"order"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string     `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool       `orm:"default(false)" json:"deleted,omitempty"`

	AppId int64 `orm:"-" json:"appId,omitempty"`
}

func (*Secret) TableName() string {
	return TableNameSecret
}

func (*secretModel) GetNames(filters map[string]interface{}) ([]Secret, error) {
	secrets := []Secret{}
	qs := Ormer().
		QueryTable(new(Secret))

	if len(filters) > 0 {
		for k, v := range filters {
			qs = qs.Filter(k, v)
		}
	}
	_, err := qs.All(&secrets, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return secrets, nil
}

func (*secretModel) UpdateOrders(secrets []*Secret) error {
	if len(secrets) < 1 {
		return errors.New("secrets' length should greater than 0. ")
	}
	batchUpateSql := fmt.Sprintf("UPDATE `%s` SET `order_id` = CASE ", TableNameSecret)
	ids := make([]string, 0)
	for _, secret := range secrets {
		ids = append(ids, strconv.Itoa(int(secret.Id)))
		batchUpateSql = fmt.Sprintf("%s WHEN `id` = %d THEN %d ", batchUpateSql, secret.Id, secret.OrderId)
	}
	batchUpateSql = fmt.Sprintf("%s END WHERE `id` IN (%s)", batchUpateSql, strings.Join(ids, ","))

	_, err := Ormer().Raw(batchUpateSql).Exec()
	return err
}

func (*secretModel) Add(m *Secret) (id int64, err error) {
	m.App = &App{Id: m.AppId}
	m.CreateTime = nil
	id, err = Ormer().Insert(m)
	return
}

func (*secretModel) UpdateById(m *Secret) (err error) {
	v := Secret{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.App = &App{Id: m.AppId}
		m.UpdateTime = nil
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*secretModel) GetById(id int64) (v *Secret, err error) {
	v = &Secret{Id: id}

	if err = Ormer().Read(v); err == nil {
		v.AppId = v.App.Id
		return v, nil
	}
	return nil, err
}

func (*secretModel) DeleteById(id int64, logical bool) (err error) {
	v := Secret{Id: id}
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
