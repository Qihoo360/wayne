package models

type configModel struct{}

type ConfigKey string

const (
	ConfigKeyTitile          ConfigKey = "system.title"
	ConfigKeyImageNamePrefix ConfigKey = "system.image-prefix"
	ConfigKeyAffinity        ConfigKey = "system.affinity"
	// redirect to monitor uri config
	// will be replace {{app.name}} to app's name
	// e.g  https://github.com/{{app.name}}, if the app name is wayne, will redirect to https://github.com/wayne
	ConfigKeyMonitorUri ConfigKey = "system.monitor-uri"
	// Option Values : join none
	// join: means ApiName will join with app name e.g. app name is wayne, deployment name is foo, the final name is wayne-foo
	// none: do nothing with the ApiName
	ConfigKeyApiNameGenerateRule ConfigKey = "system.api-name-generate-rule"

	ConfigKeyOauth2Title ConfigKey = "system.oauth2-title"

	TableNameConfig = "config"
)

type Config struct {
	Id int64 `orm:"auto" json:"id,omitempty"`

	Name  ConfigKey `orm:"size(256)" json:"name,omitempty"`
	Value string    `orm:"type(text)" json:"value,omitempty"`
}

func (*Config) TableName() string {
	return TableNameConfig
}

func (*configModel) Add(m *Config) (id int64, err error) {
	id, err = Ormer().Insert(m)
	if err != nil {
		return
	}
	return
}

func (*configModel) GetById(id int64) (v *Config, err error) {
	v = &Config{Id: id}

	if err = Ormer().Read(v); err != nil {
		return nil, err
	}
	return v, err
}

func (*configModel) UpdateById(m *Config) (err error) {
	v := Config{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*configModel) DeleteById(id int64) (err error) {
	v := Config{Id: id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		_, err = Ormer().Delete(&v)
		return err
	}
	return
}
