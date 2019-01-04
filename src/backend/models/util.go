package models

import (
	"fmt"
	"strings"

	"github.com/astaxie/beego/orm"

	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

func GetTotal(queryTable interface{}, q *common.QueryParam) (int64, error) {
	qs := Ormer().QueryTable(queryTable)
	qs = BuildFilter(qs, q.Query)
	if len(q.Groupby) != 0 {
		qs = qs.GroupBy(q.Groupby...)
	}
	return qs.Count()
}

func GetAll(queryTable interface{}, list interface{}, q *common.QueryParam) error {
	qs := Ormer().QueryTable(queryTable)
	qs = BuildFilter(qs, q.Query)
	if q.Relate != "" {
		if q.Relate == "all" {
			qs = qs.RelatedSel()
		} else {
			qs = qs.RelatedSel(q.Relate)
		}
	}
	// "column" means ASC, "-column" means DESC.
	// for example:  qs.OrderBy("-status")
	if len(q.Groupby) != 0 {
		qs = qs.GroupBy(q.Groupby...)
	}
	if q.Sortby != "" {
		qs = qs.OrderBy(q.Sortby)
	}
	if _, err := qs.Limit(q.Limit(), q.Offset()).All(list); err != nil {
		return err
	}
	return nil
}

func GetAppIdByFilter(queryTable string, filter map[string]interface{}) (err error, id int64) {
	qb := mysqlBuilder().Select("app_id").From(queryTable)
	value := []interface{}{}
	for k, v := range filter {
		qb.Where(k + " = ?")
		value = append(value, v)
	}
	o := orm.NewOrm()
	err = o.Raw(qb.String(), value...).QueryRow(&id)
	return
}

func BuildFilter(qs orm.QuerySeter, query map[string]interface{}) orm.QuerySeter {
	// query k=v
	for k, v := range query {
		// rewrite dot-notation to Object__Attribute
		k = strings.Replace(k, ".", ListFilterExprSep, -1)
		qs = qs.Filter(k, v)
	}
	return qs
}

func buildListTemplateSql(q *common.QueryParam, qb orm.QueryBuilder, table string, resourceType PublishType, isOnline bool) (orm.QueryBuilder, []interface{}) {
	qb = qb.From(fmt.Sprintf("%s T0", table))
	if isOnline {
		q.Groupby = append(q.Groupby, "id")
		qb = qb.InnerJoin("publish_status T1").
			On("T0.id=T1.template_id").And(fmt.Sprintf("T1.type=%d", resourceType))
	}
	qb, values := BuildQuery(qb, q.Query)
	qb = BuildGroupBy(qb, q.Groupby)

	return qb, values
}

func ListTemplate(list interface{}, q *common.QueryParam, table string, resourceType PublishType, isOnline bool) (total int64, err error) {
	qb := mysqlBuilder().Select("T0.*")
	qbCount := mysqlBuilder().Select("count(T0.id)")

	qb, qbValues := buildListTemplateSql(q, qb, table, resourceType, isOnline)
	qbCount, qbCountValues := buildListTemplateSql(q, qbCount, table, resourceType, isOnline)

	err = Ormer().Raw(qbCount.String(), qbCountValues).QueryRow(&total)

	if err != nil && err != orm.ErrNoRows {
		logs.Error("list tpls total error", err)
		return 0, err
	}

	qb = BuildOrder(qb, q.Sortby)
	qb = qb.Limit(int(q.Limit())).Offset(int(q.Offset()))

	_, err = Ormer().Raw(qb.String(), qbValues).QueryRows(list)
	if err != nil {
		logs.Error("list tpls error", err)
		return 0, err
	}
	return total, nil
}
