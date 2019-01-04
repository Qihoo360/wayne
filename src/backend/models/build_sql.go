package models

import (
	"fmt"
	"strings"

	"github.com/astaxie/beego/orm"

	"github.com/Qihoo360/wayne/src/backend/util/snaker"
)

// mysql operators.
var mysqlOperators = map[string]string{
	"exact":    " = ?",
	"contains": " LIKE BINARY ?",
}

func mysqlBuilder() *orm.MySQLQueryBuilder {
	return new(orm.MySQLQueryBuilder)
}

func BuildQuery(qb orm.QueryBuilder, query map[string]interface{}) (orm.QueryBuilder, []interface{}) {
	values := make([]interface{}, 0)
	if len(query) > 0 {
		querySql := make([]string, 0)

		for key, value := range query {
			queryCondition := strings.Split(key, ListFilterExprSep)
			// 不符合查询条件定义规则，跳过条件拼接
			if len(queryCondition) > 2 || len(queryCondition) == 0 {
				continue
			}
			key := queryCondition[0]
			condition := ""
			if len(queryCondition) == 1 {
				condition = " = ?"
			} else {
				var ok bool
				condition, ok = mysqlOperators[queryCondition[1]]
				if !ok {
					continue
				}
				if queryCondition[1] == "contains" {
					value = fmt.Sprintf("%%%s%%", orm.ToStr(value))
				}
			}
			values = append(values, value)
			querySql = append(querySql, "T0."+snaker.CamelToSnake(key)+condition)
		}

		qb = qb.Where(strings.Join(querySql, " and "))
	}
	return qb, values
}

func BuildGroupBy(qb orm.QueryBuilder, groupby []string) orm.QueryBuilder {
	if len(groupby) > 0 {
		groups := make([]string, 0)
		for _, group := range groupby {
			groups = append(groups, "T0."+group)
		}
		qb.GroupBy(groups...)
	}
	return qb
}

func BuildOrder(qb orm.QueryBuilder, sort string) orm.QueryBuilder {
	if sort != "" {
		asc := true
		if strings.Index(sort, "-") == 0 {
			asc = false
			sort = sort[1:]
		}
		qb = qb.OrderBy("T0." + sort)
		if asc {
			qb = qb.Asc()
		} else {
			qb = qb.Desc()
		}
	}
	return qb
}
