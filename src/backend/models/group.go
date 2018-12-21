package models

import (
	"fmt"
	"time"

	"github.com/astaxie/beego/orm"
)

type GroupType int

const (
	AppGroupType GroupType = iota
	NamespaceGroupType

	TableNameGroup = "group"
)

const (
	GroupAdmin     = "管理员"
	GroupViewer    = "访客"
	GroupDeveloper = "项目开发"
)

type groupModel struct{}

type Group struct {
	Id      int64     `orm:"pk;auto" json:"id,omitempty"`
	Name    string    `orm:"index;size(200)" json:"name,omitempty"`
	Comment string    `orm:"type(text)" json:"comment,omitempty"`
	Type    GroupType `orm:"type(integer)" json:"type"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`

	// 用于权限的关联查询
	Permissions    []*Permission    `orm:"rel(m2m);rel_table(group_permissions)" json:"permissions,omitempty"`
	AppUsers       []*AppUser       `orm:"reverse(many)" json:"appUsers,omitempty"`
	NamespaceUsers []*NamespaceUser `orm:"reverse(many)" json:"namespaceUsers,omitempty"`
}

func (g *Group) String() string {
	return fmt.Sprintf("[%d]%s", g.Id, g.Name)
}

func (*groupModel) TableUnique() [][]string {
	return [][]string{
		{"Name", "Type"},
	}
}

func (*Group) TableName() string {
	return TableNameGroup
}

// AddGroup insert a new Group into database and returns
// last inserted Id on success.
func (*groupModel) AddGroup(m *Group) (id int64, err error) {
	o := orm.NewOrm()
	err = o.Begin()
	if err != nil {
		return
	}
	m.CreateTime = nil
	id, err = o.Insert(m)
	if err != nil {
		o.Rollback()
		return
	}
	if len(m.Permissions) > 0 {
		m2m := o.QueryM2M(m, "Permissions")
		_, err = m2m.Add(m.Permissions)
		if err != nil {
			o.Rollback()
			return
		}
	}
	o.Commit()
	return
}

func (m *groupModel) GetGroupByPermission(perType string, perAction string) (gids []int64, err error) {
	qs := Ormer().QueryTable(TableNameGroup)
	if perType != "" {
		qs = qs.Filter("Permissions__Permission__Type__contains", perType)
	}
	if perAction != "" {
		qs = qs.Filter("Permissions__Permission__Name__contains", perAction)
	}
	groups := []Group{}
	if _, err = qs.All(&groups); err != nil {
		return
	}
	for _, group := range groups {
		gids = append(gids, group.Id)
	}
	return
}

// GetGroupById retrieves Group by Id. Returns error if
// Id doesn't exist
func (*groupModel) GetGroupById(id int64) (v *Group, err error) {
	v = &Group{Id: id}
	if err = Ormer().Read(v); err != nil {
		return nil, err
	}
	_, err = Ormer().LoadRelated(v, "Permissions")
	if err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateGroup updates Group by Id and returns error if
// the record to be updated doesn't exist
func (*groupModel) UpdateGroupById(m *Group) (err error) {
	o := orm.NewOrm()
	err = o.Begin()
	if err != nil {
		return
	}
	v := Group{Id: m.Id}
	if err = o.Read(&v); err != nil {
		return
	}
	m.UpdateTime = nil
	if _, err = o.Update(m); err != nil {
		o.Rollback()
		return
	}
	m2m := o.QueryM2M(m, "Permissions")
	_, err = m2m.Clear()
	if err != nil {
		o.Rollback()
		return
	}
	if len(m.Permissions) > 0 {
		_, err = m2m.Add(m.Permissions)
		if err != nil {
			o.Rollback()
			return
		}
	}
	o.Commit()
	return
}

// DeleteGroup deletes Group by Id and returns error if
// the record to be deleted doesn't exist
func (*groupModel) DeleteGroup(id int64) (err error) {
	o := orm.NewOrm()
	err = o.Begin()
	if err != nil {
		return
	}
	v := Group{Id: id}
	// ascertain id exists in the database
	if err = o.Read(&v); err != nil {
		o.Rollback()
		return
	}

	// 清除Permission的关联
	m2m := o.QueryM2M(&v, "Permissions")
	_, err = m2m.Clear()
	if err != nil {
		o.Rollback()
		return
	}

	if _, err = o.Delete(&Group{Id: id}); err != nil {
		o.Rollback()
		return
	}
	o.Commit()
	return
}
