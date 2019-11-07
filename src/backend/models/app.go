package models

import (
	"fmt"
	"time"

	"github.com/astaxie/beego/orm"
	"github.com/go-sql-driver/mysql"

	"github.com/Qihoo360/wayne/src/backend/common"
)

const (
	TableNameApp = "app"
)

type appModel struct{}

type App struct {
	Id        int64      `orm:"auto" json:"id,omitempty"`
	Name      string     `orm:"index;size(128)" json:"name,omitempty"`
	Namespace *Namespace `orm:"index;column(namespace_id);rel(fk)" json:"namespace"`
	/*
		{
		    "mode": "beta",
		    "system.api-name-generate-rule":"none" // refers to models.Config ConfigKeyApiNameGenerateRule
		}
	*/
	MetaData    string `orm:"type(text)" json:"metaData,omitempty"`
	Description string `orm:"null;size(512)" json:"description,omitempty"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string     `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool       `orm:"default(false)" json:"deleted,omitempty"`
	Migrated   bool       `orm:"default(false)" json:"migrated,omitempty"`

	// 用于权限的关联查询
	AppUsers []*AppUser `orm:"reverse(many)" json:"-"`

	// 关注的关联查询
	AppStars []*AppStarred `orm:"reverse(many)" json:"-"`
}

func (a *App) String() string {
	return fmt.Sprintf("[%d]%s", a.Id, a.Name)
}

func (*App) TableName() string {
	return TableNameApp
}

// 由于beego已注册的model columns会缓存，而标记为orm:"-"的column不会缓存进去
// 会导致orm:"-"的column 使用QueryRows无法查询
// 具体代码：astaxie/beego/orm/orm_raw.go QueryRows
type AppStar struct {
	App

	CreateTime    time.Time `json:"createTime"`
	NamespaceId   int64     `json:"namespaceId"`
	NamespaceName string    `json:"namespaceName"`
	Starred       bool      `json:"starred"`
}

type AppStatistics struct {
	Total   int64              `json:"total,omitempty"`
	Details *[]NamespaceDetail `json:"details,omitempty"`
}

type NamespaceDetail struct {
	Name  string `json:"name"`
	Count int64  `json:"count"`
}

func (*appModel) List(q *common.QueryParam, starred bool, userId int64) (apps []AppStar, err error) {
	qb := mysqlBuilder().Select("T0.*,T3.name as namespace_name,(case when isnull(T1.id ) then 0 else 1 end ) as starred").From("app T0")
	if starred {
		qb = qb.InnerJoin("app_starred T1").On("T0.id=T1.app_id").And(fmt.Sprintf("T1.user_id=%d", userId))
	} else {
		qb = qb.LeftJoin("app_starred T1").On("T0.id=T1.app_id").And(fmt.Sprintf("T1.user_id=%d", userId))
	}
	qb = qb.InnerJoin(fmt.Sprintf("%s T3", TableNameNamespace)).On("T3.id = T0.namespace_id")
	qb, values := BuildQuery(qb, q.Query)
	qb = BuildGroupBy(qb, q.Groupby)
	qb = BuildOrder(qb, q.Sortby)
	qb = qb.Limit(int(q.Limit())).Offset(int(q.Offset()))
	_, err = Ormer().Raw(qb.String(), values).QueryRows(&apps)
	if err != nil {
		return nil, err
	}
	for i := 0; i < len(apps); i++ {
		apps[i].App.Namespace = &Namespace{Id: apps[i].NamespaceId}
	}

	return
}

func (*appModel) Count(q *common.QueryParam, starred bool, userId int64) (total int64, err error) {
	qb := mysqlBuilder().Select("count(T0.id)").From("app T0")
	if starred {
		qb = qb.InnerJoin("app_starred T1").On("T0.id=T1.app_id").And(fmt.Sprintf("T1.user_id=%d", userId))
	}
	qb = qb.InnerJoin(fmt.Sprintf("%s T3", TableNameNamespace)).On("T3.id = T0.namespace_id")
	qb, values := BuildQuery(qb, q.Query)
	qb = BuildGroupBy(qb, q.Groupby)
	err = Ormer().Raw(qb.String(), values).QueryRow(&total)
	return
}

func (*appModel) GetAppCountGroupByNamespace() (*[]NamespaceDetail, error) {
	sql := `SELECT namespace.name as name ,count(*) as count FROM 
             app inner join namespace on app.namespace_id=namespace.id 
             group by app.namespace_id;`
	details := &[]NamespaceDetail{}
	_, err := Ormer().Raw(sql).QueryRows(details)
	return details, err
}

func (*appModel) GetNames(deleted bool) ([]App, error) {
	apps := []App{}
	_, err := Ormer().
		QueryTable(new(App)).
		Filter("Deleted", deleted).
		All(&apps, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return apps, nil
}

func (m *appModel) GetAppsByNamespaceId(nid int64, deleted bool) (apps []App, err error) {
	qs := Ormer().QueryTable(TableNameApp).RelatedSel(TableNameNamespace).
		Filter("namespace__id__exact", nid).
		Filter("deleted__exact", deleted)
	if _, err = qs.All(&apps); err != nil {
		return
	}
	return
}

func (m *appModel) Add(a *App) (id int64, err error) {
	// add app
	err = Ormer().Read(a, "name", "namespace_id")
	if err != nil {
		// Apps with duplicate names are not allowed to appear under the same namespace
		if err == orm.ErrNoRows {
			id, err = Ormer().Insert(a)
			return
		}
	}

	err = &mysql.MySQLError{
		Number:  1062,
		Message: "Resources already exist!",
	}
	return
}

func (*appModel) GetById(id int64) (v *App, err error) {
	v = &App{Id: id}

	if err = Ormer().Read(v); err != nil {
		return nil, err
	}
	_, err = Ormer().LoadRelated(v, "namespace")
	if err == nil {
		return v, nil
	}
	return nil, err
}

func (*appModel) UpdateById(m *App) (err error) {
	v := App{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*appModel) DeleteById(id int64, logical bool) (err error) {
	v := App{Id: id}
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

func (*appModel) GetByName(name string) (a *App, err error) {
	a = &App{Name: name}
	if err = Ormer().Read(a, "name"); err == nil {
		return a, nil
	}
	return nil, err
}

func (*appModel) GetByNameAndDeleted(name string, deleted bool) (a *App, err error) {
	a = &App{Name: name, Deleted: deleted}
	if err = Ormer().Read(a, "name", "deleted"); err == nil {
		return a, nil
	}
	return nil, err
}

// change namespaceId of app from sourceId to targetId
func (*appModel) UpdateByNamespaceId(sourceId, targetId int64) (err error) {
	var sql string
	sql = "update " + TableNameApp + " set namespace_id=?, migrated=1 where namespace_id=?;"
	args := [...]interface{} {
		targetId,
		sourceId,
	}
	_, err = orm.NewOrm().Raw(sql, args).Exec()
	return
}