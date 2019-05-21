package models

import (
	"time"
)

type ResourceName string

const (
	Mem ResourceName = "mem"
	Cpu ResourceName = "cpu"

	TableNameCharge = "charge"
)

type chargeModel struct{}

type Charge struct {
	Id        int64  `orm:"auto" json:"id,omitempty"`
	Namespace string `orm:"size(1024)" json:"namespace,omitempty"`
	App       string `orm:"index;size(128)" json:"app,omitempty"`
	Name      string `orm:"size(1024)" json:"name,omitempty"`
	Type      string `orm:"index;size(128)" json:"type,omitempty"`

	UnitPrice float64 `orm:"digits(12);decimals(4)" json:"unitPrice,omitempty"`
	Quantity  int     `orm:"int(11)" json:"quantity,omitempty"`
	Amount    float64 `orm:"digits(12);decimals(4)" json:"amount,omitempty"`

	ResourceName ResourceName `orm:"size(1024)" json:"resourceName,omitempty"`
	StartTime    *time.Time   `orm:"type(datetime)" json:"startTime,omitempty"`
	CreateTime   *time.Time   `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
}

func (*Charge) TableName() string {
	return TableNameCharge
}

func (a *chargeModel) Insert(b *Charge) error {
	_, err := Ormer().Insert(b)
	return err
}
