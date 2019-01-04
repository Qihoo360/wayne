package models

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
)

const TableNameIngress = "ingress"

type ingressModel struct {
}

type Ingress struct {
	Id          int64  `orm:"auto" json:"id,omitempty"`
	Name        string `orm:"unique;index;size(128)" json:"name,omitempty"`
	MetaData    string `orm:"type(text)" json:"metaData,omitempty"`
	App         *App   `orm:"index;rel(fk)" json:"app,omitempty"`
	Description string `orm:"null,size(512)" json:"description,omitempty"`
	OrderId     int64  `orm:"index;default(0)" json:"order"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string     `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool       `orm:"default(false)" json:"deleted,omitempty"`

	AppId int64 `orm:"-" json:"appId,omitempty"`
}

func (*Ingress) TableName() string {
	return TableNameIngress
}

func (*ingressModel) GetNames(filters map[string]interface{}) (ingreses []Ingress, err error) {
	qs := Ormer().QueryTable(new(Ingress))
	if len(filters) > 0 {
		for k, v := range filters {
			qs = qs.Filter(k, v)
		}
	}

	_, err = qs.All(&ingreses, "Id", "Name")
	if err != nil {
		return nil, err
	}
	return
}

func (*ingressModel) Add(ingr *Ingress) (id int64, err error) {
	ingr.App = &App{Id: ingr.AppId}
	ingr.CreateTime = nil
	id, err = Ormer().Insert(ingr)
	return
}

func (*ingressModel) UpdateOrders(ingrs []*Ingress) error {
	if len(ingrs) <= 0 {
		return errors.New("need at lest one ingress")
	}
	batchUpdateSql := fmt.Sprintf("update `%s` set `order_id` = case ", TableNameIngress)
	ids := make([]string, 0)
	for _, ingr := range ingrs {
		ids = append(ids, strconv.Itoa(int(ingr.Id)))
		batchUpdateSql = fmt.Sprintf("%s when `id` = %d then %d ", batchUpdateSql, ingr.Id, ingr.OrderId)
	}
	batchUpdateSql = fmt.Sprintf("%s end where `id` in (%s)", batchUpdateSql, strings.Join(ids, ","))

	_, err := Ormer().Raw(batchUpdateSql).Exec()
	return err
}

func (*ingressModel) UpdateById(m *Ingress) (err error) {
	v := Ingress{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.UpdateTime = nil
		m.App = &App{Id: m.AppId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*ingressModel) GetById(id int64) (v *Ingress, err error) {
	v = new(Ingress)
	v.Id = id

	if err = Ormer().Read(v); err != nil {
		return nil, err
	}
	v.AppId = v.App.Id
	return
}

func (*ingressModel) DeleteById(id int64, logical bool) (err error) {
	v := Ingress{Id: id}

	if err = Ormer().Read(&v); err != nil {
		return
	}
	if logical {
		v.Deleted = true
		_, err = Ormer().Update(&v)
		return
	}
	_, err = Ormer().Delete(&v)
	return
}
