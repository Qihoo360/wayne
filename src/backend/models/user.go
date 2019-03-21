package models

import (
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"

	"github.com/Qihoo360/wayne/src/backend/util/encode"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type UserType int

const (
	DefaultUser UserType = iota
	SystemUser
	APIUser

	TableNameUser = "user"
)

type userModel struct{}

var (
	APIKeyUser = User{
		Id:      0,
		Name:    "OpenAPI",
		Type:    APIUser,
		Display: "OpenAPI",
	}

	AnonymousUser = User{
		Id:      0,
		Name:    "Anonymous",
		Type:    DefaultUser,
		Display: "Anonymous",
	}
)

type User struct {
	Id        int64      `orm:"pk;auto" json:"id,omitempty"`
	Name      string     `orm:"index;unique;size(200)" json:"name,omitempty"`
	Password  string     `orm:"size(255)" json:"-"`
	Salt      string     `orm:"size(32)" json:"-"`
	Email     string     `orm:"unique;size(200)" json:"email,omitempty"`
	Display   string     `orm:"size(200)" json:"display,omitempty"`
	Comment   string     `orm:"type(text)" json:"comment,omitempty"`
	Type      UserType   `orm:"type(integer)" json:"type"`
	Admin     bool       `orm:"default(False)" json:"admin"`
	LastLogin *time.Time `orm:"auto_now_add;type(datetime)" json:"lastLogin,omitempty"`
	LastIp    string     `orm:"size(200)" json:"lastIp,omitempty"`

	Deleted    bool       `orm:"default(false)" json:"deleted,omitempty"`
	CreateTime *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`

	Namespaces []*Namespace `orm:"-" json:"namespaces,omitempty"`
}

type UserStatistics struct {
	Total int64 `json:"total,omitempty"`
}

func (*User) TableName() string {
	return TableNameUser
}

func (u *User) GetTypeName() string {
	mapDict := map[UserType]string{
		DefaultUser: "default",
		SystemUser:  "system",
		APIUser:     "api",
	}
	name, ok := mapDict[u.Type]
	if ok == false {
		return ""
	}
	return name
}

func (*userModel) AddUser(m *User) (id int64, err error) {
	id, err = Ormer().Insert(m)
	if err != nil {
		return
	}

	err = addDefaultNamespace(m)
	if err != nil {
		return
	}
	return id, nil
}

func addDefaultNamespace(user *User) (err error) {
	// 添加默认命名空间开发者权限
	demoNSId := beego.AppConfig.DefaultInt64("DemoNamespaceId", 1)
	demoGroupId := beego.AppConfig.DefaultInt64("DemoGroupId", 1)
	if err != nil {
		return
	}
	if (demoNSId <= 0) || (demoGroupId <= 0) {
		// 如果DemoNamespaceId小于等于0,则忽略
		return nil
	}
	defaultNS := Namespace{
		Id: demoNSId,
	}
	err = Ormer().Read(&defaultNS, "Id")
	if err == orm.ErrNoRows {
		// 如果没有默认空间，则提示报错，不再初始化
		logs.Error("can not find default demo namespace by id " + beego.AppConfig.String("DemoNamespaceId"))
		return nil
	} else if err != nil {
		return
	}

	group := Group{
		Id:   demoGroupId,
		Type: NamespaceGroupType,
	}
	err = Ormer().Read(&group, "Id", "Type")
	if err == orm.ErrNoRows {
		// 如果没有初始化角色，则不再初始化
		logs.Error("can not find default demo group by id " + beego.AppConfig.String("DemoGroupId"))
		return nil
	} else if err != nil {
		return
	}
	NamespaceUser := NamespaceUser{
		Namespace: &defaultNS,
		User:      user,
		Group:     &group,
	}
	_, _, err = Ormer().ReadOrCreate(&NamespaceUser, "User", "Namespace", "Group")
	if err != nil {
		return
	}
	return
}

func (*userModel) GetNames() ([]User, error) {
	users := []User{}
	_, err := Ormer().
		QueryTable(new(User)).
		All(&users, "Id", "Name")

	if err != nil {
		return nil, err
	}

	return users, nil
}

func (*userModel) GetUserById(id int64) (v *User, err error) {
	v = &User{Id: id}
	if err = Ormer().Read(v); err != nil {
		return nil, err
	}
	return v, nil
}

func (*userModel) GetUserByName(name string) (v *User, err error) {
	v = &User{Name: name}
	if err = Ormer().Read(v, "Name"); err != nil {
		return nil, err
	}
	return v, nil
}

func (*userModel) GetUserDetail(name string) (user *User, err error) {
	user = &User{Name: name}

	err = Ormer().Read(user, "Name")
	if err != nil {
		return nil, err
	}

	if user.Admin {
		namespaces, err := NamespaceModel.GetAll(false)
		if err != nil {
			return nil, err
		}
		user.Namespaces = namespaces
	} else {
		namespaceUsers := []NamespaceUser{}
		cond := orm.NewCondition()
		condNS := cond.And("User__Id__exact", user.Id)
		_, err = Ormer().QueryTable(TableNameNamespaceUser).
			SetCond(condNS).
			RelatedSel("Namespace").
			GroupBy("Namespace").
			OrderBy("Namespace__Name").
			All(&namespaceUsers)
		if err != nil {
			return nil, err
		}
		for _, namespaceUser := range namespaceUsers {
			user.Namespaces = append(user.Namespaces, namespaceUser.Namespace)
		}
	}

	return user, nil
}

func (*userModel) EnsureUser(m *User) (*User, error) {
	oldUser := &User{Name: m.Name}
	err := Ormer().Read(oldUser, "Name")
	if err != nil {
		if err == orm.ErrNoRows {
			_, err := UserModel.AddUser(m)
			if err != nil {
				return nil, err
			}
			oldUser = m
		} else {
			return nil, err
		}
	} else {
		oldUser.Email = m.Email
		oldUser.Display = m.Display
		oldUser.LastLogin = m.LastLogin
		oldUser.LastIp = m.LastIp
		_, err := Ormer().Update(oldUser)
		if err != nil {
			return nil, err
		}
	}

	err = addDefaultNamespace(oldUser)
	return oldUser, err
}

func (*userModel) UpdateUserAdmin(m *User) (err error) {
	v := &User{Id: m.Id}
	if err = Ormer().Read(v); err != nil {
		return
	}
	v.Admin = m.Admin
	_, err = Ormer().Update(v)
	return
}

func (*userModel) ResetUserPassword(id int64, password string) (err error) {
	v := &User{Id: id}
	if err = Ormer().Read(v); err != nil {
		return
	}
	salt := encode.GetRandomString(10)
	passwordHashed := encode.EncodePassword(password, salt)

	v.Password = passwordHashed
	v.Salt = salt
	_, err = Ormer().Update(v)
	return
}

func (*userModel) UpdateUserById(m *User) (err error) {
	v := &User{Id: m.Id}
	if err = Ormer().Read(v); err != nil {
		return
	}
	v.Name = m.Name
	v.Email = m.Email
	v.Display = m.Display
	v.Comment = m.Comment
	_, err = Ormer().Update(v)
	return
}

func (*userModel) DeleteUser(id int64) (err error) {
	v := User{Id: id}
	if err = Ormer().Read(&v); err != nil {
		return
	}
	_, err = Ormer().Delete(&User{Id: id})
	return
}
