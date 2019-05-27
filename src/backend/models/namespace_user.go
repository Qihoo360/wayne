package models

import (
	"strconv"
	"strings"
	"time"

	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/utils"
)

const (
	TableNameNamespaceUser = "namespace_user"
)

type namespaceUserModel struct{}

type NamespaceUser struct {
	Id        int64      `orm:"auto" json:"id,omitempty"`
	Namespace *Namespace `orm:"index;rel(fk);column(namespace_id)" json:"namespace,omitempty"`
	User      *User      `orm:"index;rel(fk);column(user_id)" json:"user,omitempty"`
	Group     *Group     `orm:"index;rel(fk)" json:"group,omitempty"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`

	Groups     []*Group `orm:"-" json:"groups,omitempty"`
	GroupsName string   `orm:"-" json:"groupsName,omitempty"`
}

func (*NamespaceUser) TableName() string {
	return TableNameNamespaceUser
}

func (*namespaceUserModel) TableUnique() [][]string {
	return [][]string{
		{"User", "Namespace", "Group"},
	}
}

func (*namespaceUserModel) GetByNamespaceIdAndUserId(namespaceId, userId int64) (*NamespaceUser, error) {
	nsUser := NamespaceUser{
		Namespace: &Namespace{Id: namespaceId},
		User:      &User{Id: userId},
	}
	err := Ormer().Read(&nsUser, "Namespace", "User")
	return &nsUser, err
}

func (n *namespaceUserModel) SetGroupsName(m []NamespaceUser) (err error) {
	if len(m) <= 0 {
		return
	}
	uIds := []int{}
	uIdsJoin := []string{}
	var namespaceId int
	for _, NsUser := range m {
		uIds = append(uIds, int(NsUser.User.Id))
		uIdsJoin = append(uIdsJoin, "?")
		namespaceId = int(NsUser.Namespace.Id)
	}
	uIdsJoinStr := strings.Join(uIdsJoin, ", ")
	var maps []orm.Params
	var sql string
	sql = "SELECT a.user_id, GROUP_CONCAT(b.name) as groups_name FROM " + TableNameNamespaceUser + " as a INNER JOIN `" +
		TableNameGroup +
		"` as b ON a.group_id = b.id WHERE a.namespace_id = ? and user_id in (" +
		uIdsJoinStr +
		") GROUP BY a.namespace_id, a.user_id"
	num, err := Ormer().Raw(sql, namespaceId, uIds).Values(&maps)
	if err == nil && num > 0 {
		groupsNameMap := make(map[int64]string)
		for _, row := range maps {
			userIdInt64, err := strconv.ParseInt(row["user_id"].(string), 10, 64)
			if err != nil {
				return err
			}
			groupsNameMap[userIdInt64] = row["groups_name"].(string)
		}
		for index, NsUser := range m {
			m[index].GroupsName = groupsNameMap[NsUser.User.Id]
		}
	}
	return
}

func (*namespaceUserModel) Add(m *NamespaceUser, allGroupFlag bool) (id int64, err error) {
	o := orm.NewOrm()
	err = o.Begin()
	if err != nil {
		return
	}
	if allGroupFlag {
		for _, Group := range m.Groups {
			newNamespaceUser := NamespaceUser{
				Namespace: m.Namespace,
				User:      m.User,
				Group:     Group,
			}
			_, _, err := o.ReadOrCreate(&newNamespaceUser, "Namespace", "User", "Group")
			if err != nil {
				continue
			}
		}
	} else {
		m.CreateTime = nil
		id, err = o.Insert(m)
	}
	if err != nil {
		o.Rollback()
		return
	}
	o.Commit()
	return id, nil
}

func (n *namespaceUserModel) GetById(id int64, allGroupFlag bool) (v *NamespaceUser, err error) {
	v = &NamespaceUser{Id: id}
	if err = Ormer().QueryTable(TableNameNamespaceUser).Filter("Id", id).RelatedSel("User").One(v); err != nil {
		return nil, err
	}
	if allGroupFlag {
		namespaceUsers := []NamespaceUser{}
		_, err := Ormer().QueryTable(TableNameNamespaceUser).Filter("Namespace", v.Namespace.Id).Filter("User", v.User.Id).RelatedSel("Group").All(&namespaceUsers)
		if err != nil {
			return nil, err
		}
		for _, namespaceUser := range namespaceUsers {
			v.Groups = append(v.Groups, namespaceUser.Group)
		}
		v.Group = nil
	}
	return
}

func (m *namespaceUserModel) GetUserListByNamespaceId(nid int64) (nsUsers []NamespaceUser, err error) {
	qs := Ormer().QueryTable(TableNameNamespaceUser).RelatedSel(TableNameUser).RelatedSel(TableNameGroup).
		Filter("namespace__id__exact", nid)
	if _, err = qs.All(&nsUsers); err != nil {
		return
	}
	return
}

func (n *namespaceUserModel) GetNSId(uid int64, perName string) (nids []int64, err error) {
	qs := Ormer().QueryTable(TableNameNamespaceUser).
		Filter("user__id__exact", uid).
		Filter("Group__Type__exact", NamespaceGroupType).
		Filter("Group__Permissions__Permission__Name__contains", perName)

	namespaceUsers := []NamespaceUser{}
	if _, err = qs.All(&namespaceUsers); err != nil {
		return
	}
	for _, namespaceUser := range namespaceUsers {
		nids = append(nids, namespaceUser.Namespace.Id)
	}
	return
}

func (n *namespaceUserModel) UpdateById(m *NamespaceUser, allGroupFlag bool) (err error) {
	o := orm.NewOrm()
	err = o.Begin()
	if err != nil {
		return
	}
	if allGroupFlag {
		var newGIDSlice []interface{}
		var oldGIDSlice []interface{}
		// 先将新提交的内容存入数据库
		for _, Group := range m.Groups {
			newNamespaceUser := NamespaceUser{
				Namespace: m.Namespace,
				User:      m.User,
				Group:     Group,
			}
			newGIDSlice = append(newGIDSlice, Group.Id)
			_, _, err := o.ReadOrCreate(&newNamespaceUser, "Namespace", "User", "Group")
			if err != nil {
				break
			}
		}

		// 删除数据库中不再需要的内容
		oldNUs := []NamespaceUser{}
		_, err = o.QueryTable(TableNameNamespaceUser).Filter("Namespace", m.Namespace.Id).Filter("User", m.User.Id).RelatedSel("Group").All(&oldNUs)
		if err == nil {
			for _, oldNU := range oldNUs {
				oldGIDSlice = append(oldGIDSlice, oldNU.Group.Id)
			}
			diff := utils.SliceDiff(oldGIDSlice, newGIDSlice)
			for _, one := range diff {
				_, err = o.Delete(&NamespaceUser{
					Namespace: m.Namespace,
					User:      m.User,
					Group:     &Group{Id: one.(int64)},
				}, "Namespace", "User", "Group")
				if err != nil {
					break
				}
			}
		}
	} else {
		m.UpdateTime = nil
		_, err = o.Update(m)
	}

	if err != nil {
		o.Rollback()
		return
	}

	o.Commit()
	return
}

func (*namespaceUserModel) DeleteById(id int64, allGroupFlag bool) (err error) {
	v := NamespaceUser{Id: id}
	if err = Ormer().Read(&v); err != nil {
		return
	}

	if allGroupFlag {
		_, err = Ormer().Delete(&NamespaceUser{
			Namespace: v.Namespace,
			User:      v.User,
		}, "Namespace", "User")
	} else {
		_, err = Ormer().Delete(&v)
	}

	return err
}

func (n *namespaceUserModel) GetOneByPermission(nsId int64, userId int64, perName string) (namespaceUser NamespaceUser, err error) {
	err = Ormer().QueryTable(TableNameNamespaceUser).
		Filter("Namespace__Id__exact", nsId).
		Filter("User__Id__exact", userId).
		Filter("Group__Permissions__Permission__Name__contains", perName).
		One(&namespaceUser)
	return
}

func (n *namespaceUserModel) GetAllPermission(aid int64, uid int64) (permissions []Permission, err error) {
	qs := Ormer().QueryTable(new(Permission)).
		Filter("Groups__Group__Type__exact", NamespaceGroupType).
		Filter("Groups__Group__NamespaceUsers__Namespace__Id__exact", aid).
		Filter("Groups__Group__NamespaceUsers__User__Id__exact", uid)
	permissions = []Permission{}
	if _, err = qs.All(&permissions); err != nil {
		return
	}
	return
}
