package models

import (
	"time"
)

const (
	TableNameInvoice = "invoice"
)

type invoiceModel struct{}

type Invoice struct {
	Id        int64  `orm:"auto" json:"id,omitempty"`
	Namespace string `orm:"size(1024)" json:"namespace,omitempty"`
	App       string `orm:"index;size(128)" json:"app,omitempty"`

	Amount float64 `orm:"digits(12);decimals(4)" json:"amount,omitempty"`

	StartDate *time.Time `orm:"type(datetime)" json:"startDate,omitempty"`
	EndDate   *time.Time `orm:"type(datetime)" json:"endDate,omitempty"`
	BillDate  *time.Time `orm:"type(datetime)" json:"billDate,omitempty"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
}

func (*Invoice) TableName() string {
	return TableNameInvoice
}
