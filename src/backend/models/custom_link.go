package models

const (
	TableNameCustomLink = "custom_link"
)

type customLinkModel struct{}

type CustomLink struct {
	Id int64 `orm:"auto" json:"id,omitempty"`
	// namespace name
	Namespace string `orm:"index;namespace;" json:"namespace"`
	// LinkType typeName
	LinkType string `orm:"size(255)" json:"linkType,omitempty"`
	Url      string `orm:"size(255)" json:"url,omitempty"`
	AddParam bool   `orm:"default(false)" json:"addParam,omitempty"`
	Params   string `orm:"size(255);null" json:"params,omitempty"`
	Deleted  bool   `orm:"default(false)" json:"deleted,omitempty"`
	//链接状态，默认启用，false为禁用
	Status bool `orm:"default(true)" json:"status,omitempty"`

	Displayname string `orm:"-" json:"displayname,omitempty"`
}

func (*CustomLink) TableName() string {
	return TableNameCustomLink
}

func (*customLinkModel) GetAll(deleted bool) ([]*CustomLink, error) {
	customLinks := []*CustomLink{}
	_, err := Ormer().
		QueryTable(new(CustomLink)).
		Filter("Deleted", deleted).
		OrderBy("Id").
		All(&customLinks)

	if err != nil {
		return nil, err
	}

	return customLinks, nil
}

//get links by link type
func (*customLinkModel) GetByLinkType(linkType string, deleted bool) ([]*CustomLink, error) {
	customLinks := []*CustomLink{}
	_, err := Ormer().
		QueryTable(new(CustomLink)).
		Filter("Deleted", deleted).
		Filter("LinkType", linkType).
		OrderBy("Id").
		All(&customLinks)

	if err != nil {
		return nil, err
	}

	return customLinks, nil
}

//get links by namespace name
func (*customLinkModel) GetByNsName(nsName string, deleted bool) ([]*CustomLink, error) {
	customLinks := []*CustomLink{}
	_, err := Ormer().
		QueryTable(new(CustomLink)).
		Filter("Deleted", deleted).
		Filter("Namespace", nsName).
		OrderBy("Id").
		All(&customLinks)

	if err != nil {
		return nil, err
	}

	return customLinks, nil
}

func (*customLinkModel) GetById(id int64) (v *CustomLink, err error) {
	v = &CustomLink{Id: id}

	if err = Ormer().Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

func (*customLinkModel) Add(m *CustomLink) (id int64, err error) {
	id, err = Ormer().Insert(m)
	if err != nil {
		return
	}
	return
}

// UpdateById updates CustomLink by Id and returns error if
// the record to be updated doesn't exist
func (*customLinkModel) UpdateById(m *CustomLink) (err error) {
	v := CustomLink{Id: m.Id}
	// as certain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		_, err = Ormer().Update(m)
		return err
	}
	return
}

// Delete deletes CustomLink by Id and returns error if
// the record to be deleted doesn't exist
func (*customLinkModel) DeleteById(id int64, logical bool) (err error) {
	v := CustomLink{Id: id}
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

func (*customLinkModel) ChangeStatusById(id int64) (err error) {
	v := CustomLink{Id: id}
	// as certain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		v.Status = !v.Status
		_, err = Ormer().Update(&v)
		return err
	}
	return
}
