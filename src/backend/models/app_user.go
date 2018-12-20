package models

import (
	"strconv"
	"strings"
	"time"

	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/utils"
)

const (
	TableNameAppUser = "app_user"
)

type appUserModel struct{}

type AppUser struct {
	Id    int64  `orm:"auto" json:"id,omitempty"`
	App   *App   `orm:"index;rel(fk);column(app_id)" json:"app,omitempty"`
	User  *User  `orm:"index;rel(fk);column(user_id)" json:"user,omitempty"`
	Group *Group `orm:"index;rel(fk)" json:"group,omitempty"`

	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`

	Groups     []*Group `orm:"-" json:"groups,omitempty"`
	GroupsName string   `orm:"-" json:"groupsName,omitempty"`
}

func (*AppUser) TableName() string {
	return TableNameAppUser
}

func (*appUserModel) TableUnique() [][]string {
	return [][]string{
		{"User", "App", "Group"},
	}
}

func (a *appUserModel) SetGroupsName(m []AppUser) (err error) {
	if len(m) <= 0 {
		return
	}
	uIds := []int{}
	uIdsJoin := []string{}
	var appId int
	for _, AppUser := range m {
		uIds = append(uIds, int(AppUser.User.Id))
		uIdsJoin = append(uIdsJoin, "?")
		appId = int(AppUser.App.Id)
	}
	uIdsJoinStr := strings.Join(uIdsJoin, ", ")
	var maps []orm.Params
	var sql string
	sql = "SELECT a.user_id, GROUP_CONCAT(b.name) as groups_name FROM " +
		TableNameAppUser +
		" as a INNER JOIN `" +
		TableNameGroup +
		"` as b ON a.group_id = b.id WHERE a.app_id = ? and user_id in (" +
		uIdsJoinStr +
		") GROUP BY a.app_id, a.user_id"
	num, err := Ormer().Raw(sql, appId, uIds).Values(&maps)
	if err == nil && num > 0 {
		groupsNameMap := make(map[int64]string)
		for _, row := range maps {
			userIdInt64, err := strconv.ParseInt(row["user_id"].(string), 10, 64)
			if err != nil {
				return err
			}
			groupsNameMap[userIdInt64] = row["groups_name"].(string)
		}
		for index, AppUser := range m {
			m[index].GroupsName = groupsNameMap[AppUser.User.Id]
		}
	}
	return
}

func (*appUserModel) Add(m *AppUser, allGroupFlag bool) (id int64, err error) {
	o := orm.NewOrm()
	err = o.Begin()
	if err != nil {
		return
	}

	if allGroupFlag {
		for _, Group := range m.Groups {
			newAppUser := AppUser{
				App:   m.App,
				User:  m.User,
				Group: Group,
			}
			_, _, err := o.ReadOrCreate(&newAppUser, "App", "User", "Group")
			if err != nil {
				continue
			}
		}
	} else {
		m.CreateTime = nil
		id, err = o.Insert(m)
		if err != nil {
			o.Rollback()
			return
		}
	}

	o.Commit()
	return id, nil
}

func (m *appUserModel) GetAllPermission(aid int64, uid int64) (permissions []Permission, err error) {
	qs := Ormer().QueryTable(new(Permission)).
		Filter("Groups__Group__Type__exact", AppGroupType).
		Filter("Groups__Group__AppUsers__App__Id__exact", aid).
		Filter("Groups__Group__AppUsers__User__Id__exact", uid)
	permissions = []Permission{}
	if _, err = qs.All(&permissions); err != nil {
		return
	}
	return
}

func (m *appUserModel) GetOneByPermission(appId int64, userId int64, perName string) (appUser AppUser, err error) {
	err = Ormer().QueryTable(TableNameAppUser).
		Filter("App__Id__exact", appId).
		Filter("User__Id__exact", userId).
		Filter("Group__Permissions__Permission__Name__contains", perName).
		One(&appUser)
	return
}

func (m *appUserModel) GetAppIdByUser(uid int64, perName string) (aids []int64, err error) {
	qs := Ormer().QueryTable(TableNameAppUser).
		Filter("user__id__exact", uid).
		Filter("Groups__Group__Type__exact", AppGroupType).
		Filter("Group__Permissions__Permission__Name__contains", perName)

	appUsers := []AppUser{}
	if _, err = qs.All(&appUsers); err != nil {
		return
	}
	for _, appUser := range appUsers {
		aids = append(aids, appUser.App.Id)
	}
	return
}

func (m *appUserModel) GetUserListByAppId(aid int64) (appUsers []AppUser, err error) {
	qs := Ormer().QueryTable(TableNameAppUser).RelatedSel(TableNameUser).RelatedSel(TableNameGroup).
		Filter("app__id__exact", aid)
	if _, err = qs.All(&appUsers); err != nil {
		return
	}
	return
}

func (a *appUserModel) GetById(id int64, allGroupFlag bool) (v *AppUser, err error) {
	v = &AppUser{Id: id}

	if err = Ormer().Read(v); err != nil {
		return nil, err
	}
	v.User, err = UserModel.GetUserById(v.User.Id)
	if err != nil {
		return nil, err
	}

	if allGroupFlag {
		appUsers := []AppUser{}
		_, err := Ormer().QueryTable(TableNameAppUser).Filter("App", v.App.Id).Filter("User", v.User.Id).RelatedSel("Group").All(&appUsers)
		if err == orm.ErrNoRows {
			return v, nil
		} else if err != nil {
			return nil, err
		}
		for _, appUser := range appUsers {
			v.Groups = append(v.Groups, appUser.Group)
		}
		v.Group = nil
	}
	return
}

func (a *appUserModel) UpdateById(m *AppUser, allGroupFlag bool) (err error) {
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
			newAppUser := AppUser{
				App:   m.App,
				User:  m.User,
				Group: Group,
			}
			newGIDSlice = append(newGIDSlice, Group.Id)
			_, _, err := o.ReadOrCreate(&newAppUser, "App", "User", "Group")
			if err != nil {
				break
			}
		}

		// 删除数据库中不再需要的内容
		oldNUs := []AppUser{}
		_, err = o.QueryTable(TableNameAppUser).Filter("App", m.App.Id).Filter("User", m.User.Id).RelatedSel("Group").All(&oldNUs)
		if err == nil {
			for _, oldNU := range oldNUs {
				oldGIDSlice = append(oldGIDSlice, oldNU.Group.Id)
			}
			diff := utils.SliceDiff(oldGIDSlice, newGIDSlice)
			for _, one := range diff {
				_, err = o.Delete(&AppUser{
					App:   m.App,
					User:  m.User,
					Group: &Group{Id: one.(int64)},
				}, "App", "User", "Group")
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

func (*appUserModel) DeleteById(id int64, allGroupFlag bool) (err error) {
	v := AppUser{Id: id}
	if err = Ormer().Read(&v); err != nil {
		return
	}

	if allGroupFlag {
		_, err = Ormer().Delete(&AppUser{
			App:  v.App,
			User: v.User,
		}, "App", "User")
	} else {
		_, err = Ormer().Delete(&v)
	}

	return err
}
