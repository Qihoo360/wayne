package models

import (
	"time"
)

const (
	TableNamePersistentVolumeClaimTemplate = "persistent_volume_claim_template"
)

type persistentVolumeClaimTplModel struct{}

type PersistentVolumeClaimTemplate struct {
	Id                    int64                  `orm:"auto" json:"id,omitempty"`
	Name                  string                 `orm:"size(128)" json:"name,omitempty"`
	Template              string                 `orm:"type(text)" json:"template,omitempty"`
	PersistentVolumeClaim *PersistentVolumeClaim `orm:"index;rel(fk)" json:"persistentVolumeClaim,omitempty"`
	// 存储模版可上线机房
	// 例如{"clusters":["K8S"]}
	MetaData    string `orm:"type(text)" json:"metaData,omitempty"`
	Description string `orm:"size(512)" json:"description,omitempty"`

	CreateTime time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	User       string    `orm:"size(128)" json:"user,omitempty"`
	Deleted    bool      `orm:"default(false)" json:"deleted,omitempty"`

	Status                  []*PublishStatus `orm:"-" json:"status,omitempty"`
	PersistentVolumeClaimId int64            `orm:"-" json:"persistentVolumeClaimId,omitempty"`
}

func (*PersistentVolumeClaimTemplate) TableName() string {
	return TableNamePersistentVolumeClaimTemplate
}

func (*persistentVolumeClaimTplModel) Add(m *PersistentVolumeClaimTemplate) (id int64, err error) {
	m.PersistentVolumeClaim = &PersistentVolumeClaim{Id: m.PersistentVolumeClaimId}
	id, err = Ormer().Insert(m)
	return
}

func (*persistentVolumeClaimTplModel) UpdateById(m *PersistentVolumeClaimTemplate) (err error) {
	v := PersistentVolumeClaimTemplate{Id: m.Id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		m.PersistentVolumeClaim = &PersistentVolumeClaim{Id: m.PersistentVolumeClaimId}
		_, err = Ormer().Update(m)
		return err
	}
	return
}

func (*persistentVolumeClaimTplModel) GetById(id int64) (v *PersistentVolumeClaimTemplate, err error) {
	v = &PersistentVolumeClaimTemplate{Id: id}

	if err = Ormer().Read(v); err == nil {
		_, err = Ormer().LoadRelated(v, "PersistentVolumeClaim")
		if err == nil {
			v.PersistentVolumeClaimId = v.PersistentVolumeClaim.Id
			return v, nil
		}
	}
	return nil, err
}

func (*persistentVolumeClaimTplModel) DeleteById(id int64, logical bool) (err error) {
	v := PersistentVolumeClaimTemplate{Id: id}
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
