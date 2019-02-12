package models

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
)

const TableNameHPA = "hpa"

type hpaModel struct {
}

type HPA struct {
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

func (*HPA) TableName() string {
	return TableNameHPA
}

func (*hpaModel) GetNames(filters map[string]interface{}) ([]HPA, error) {
	hpas := []HPA{}
	qs := Ormer().
		QueryTable(new(HPA))

	if len(filters) > 0 {
		for k, v := range filters {
			qs = qs.Filter(k, v)
		}
	}
	_, err := qs.All(&hpas, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return hpas, nil
}

func (*hpaModel) Add(hpa *HPA) (id int64, err error) {
	hpa.App = &App{Id: hpa.AppId}
	hpa.CreateTime = nil
	id, err = Ormer().Insert(hpa)
	return
}

func (*hpaModel) GetById(id int64) (v *HPA, err error) {
	v = new(HPA)
	v.Id = id

	if err = Ormer().Read(v); err != nil {
		return nil, err
	}
	v.AppId = v.App.Id
	return
}

func (*hpaModel) UpdateById(m *HPA) (err error) {
	v := HPA{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.UpdateTime = nil
		m.App = &App{Id: m.AppId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*hpaModel) DeleteById(id int64, logical bool) (err error) {
	v := HPA{Id: id}

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

func (*hpaModel) UpdateOrders(hpas []*HPA) error {
	if len(hpas) <= 0 {
		return errors.New("need at lest one hpa")
	}
	batchUpdateSql := fmt.Sprintf("update `%s` set `order_id` = case ", TableNameHPA)
	ids := make([]string, 0)
	for _, hpa := range hpas {
		ids = append(ids, strconv.Itoa(int(hpa.Id)))
		batchUpdateSql = fmt.Sprintf("%s when `id` = %d then %d ", batchUpdateSql, hpa.Id, hpa.OrderId)
	}
	batchUpdateSql = fmt.Sprintf("%s end where `id` in (%s)", batchUpdateSql, strings.Join(ids, ","))

	_, err := Ormer().Raw(batchUpdateSql).Exec()
	return err
}
