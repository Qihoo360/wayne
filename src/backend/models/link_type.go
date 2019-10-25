package models

const (
	TableNameLinkType = "link_type"
)

type linkTypeModel struct{}

type LinkType struct {
	Id          int64  `orm:"auto" json:"id,omitempty"`
	TypeName    string `orm:"index;unique;size(255)" json:"typeName,omitempty"`
	Displayname string `orm:"size(255)" json:"displayname,omitempty"`
	DefaultUrl  string `orm:"size(255)" json:"defaultUrl,omitempty"`
	ParamList   string `orm:"size(255);null" json:"paramList,omitempty"`
	Deleted     bool   `orm:"default(false)" json:"deleted,omitempty"`
}

func (*LinkType) TableName() string {
	return TableNameLinkType
}

func (*linkTypeModel) GetAll(deleted bool) ([]*LinkType, error) {
	linkTypes := []*LinkType{}
	_, err := Ormer().
		QueryTable(new(LinkType)).
		Filter("Deleted", deleted).
		OrderBy("Id").
		All(&linkTypes)

	if err != nil {
		return nil, err
	}

	return linkTypes, nil
}

func (*linkTypeModel) GetByType(typeName string) (v *LinkType, err error) {
	v = &LinkType{TypeName: typeName}

	if err = Ormer().Read(v, "TypeName"); err == nil {
		return v, nil
	}
	return nil, err
}

func (*linkTypeModel) GetByTypeAndDeleted(typeName string, deleted bool) (v *LinkType, err error) {
	v = &LinkType{TypeName: typeName,
		Deleted: deleted}

	if err = Ormer().Read(v, "TypeName", "Deleted"); err == nil {
		return v, nil
	}
	return nil, err
}

func (*linkTypeModel) GetById(id int64) (v *LinkType, err error) {
	v = &LinkType{Id: id}

	if err = Ormer().Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

func (*linkTypeModel) Add(m *LinkType) (id int64, err error) {
	id, err = Ormer().Insert(m)
	if err != nil {
		return
	}
	return
}

// UpdateById updates LinkType by Id and returns error if
// the record to be updated doesn't exist
func (*linkTypeModel) UpdateById(m *LinkType) (err error) {
	v := LinkType{Id: m.Id}
	// as certain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		_, err = Ormer().Update(m)
		return err
	}
	return
}

// Delete deletes LinkType by Id and returns error if
// the record to be deleted doesn't exist
func (*linkTypeModel) DeleteById(id int64, logical bool) (err error) {
	v := LinkType{Id: id}
	// as certain id exists in the database
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
