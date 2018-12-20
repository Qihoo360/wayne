package models

const (
	TableNameAppStarred = "app_starred"
)

type appStarredModel struct{}

type AppStarred struct {
	Id   int64 `orm:"auto" json:"id,omitempty"`
	App  *App  `orm:"index;rel(fk);column(app_id)" json:"app,omitempty"`
	User *User `orm:"index;rel(fk);column(user_id)" json:"user,omitempty"`
}

func (*AppStarred) TableUnique() [][]string {
	return [][]string{
		{"App", "User"},
	}
}

func (*AppStarred) TableName() string {
	return TableNameAppStarred
}

func (*appStarredModel) Add(m *AppStarred) (id int64, err error) {
	id, err = Ormer().InsertOrUpdate(m)
	if err != nil {
		return
	}
	return
}

func (*appStarredModel) DeleteByAppId(userId int64, appId int64) (err error) {
	v := AppStarred{App: &App{Id: appId}, User: &User{Id: userId}}
	// ascertain id exists in the database
	if err = Ormer().Read(&v, "App", "User"); err == nil {
		_, err = Ormer().Delete(&v)
		return err
	}
	return
}
