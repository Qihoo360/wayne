package models

import (
	"time"

	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type publishHistoryModel struct{}

type ReleaseStatus int32

const (
	ReleaseFailure ReleaseStatus = iota
	ReleaseSuccess

	TableNamePublishHistory = "publish_history"
)

type PublishHistory struct {
	Id           int64         `orm:"auto" json:"id,omitempty"`
	Type         PublishType   `orm:"index;type(integer)" json:"type,omitempty"`
	ResourceId   int64         `orm:"index" json:"resourceId,omitempty"`
	ResourceName string        `orm:"size(128)" json:"resourceName,omitempty"`
	TemplateId   int64         `orm:"index;column(template_id)" json:"templateId,omitempty"`
	Cluster      string        `orm:"size(128)" json:"cluster,omitempty"`
	Status       ReleaseStatus `orm:"type(integer)" json:"status,omitempty"`
	Message      string        `orm:"type(text)" json:"message,omitempty"`
	User         string        `orm:"size(128)" json:"user,omitempty"`
	CreateTime   *time.Time    `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
}

func (*PublishHistory) TableName() string {
	return TableNamePublishHistory
}

type DeployCount struct {
	Date  time.Time `json:"date,omitempty"`
	Count int       `json:"count"`
}

func (*publishHistoryModel) Add(m *PublishHistory) (id int64, err error) {
	m.CreateTime = nil
	id, err = Ormer().Insert(m)
	if err != nil {
		logs.Error("publish publishStatus (%v) to db error.%v", m, err)
	}
	return
}

func (*publishHistoryModel) GetDeployCountByDay(startTime time.Time, endTime time.Time) (*[]DeployCount, error) {

	sql := `SELECT DATE_FORMAT( create_time, "%Y-%m-%d" ) as date, COUNT( * ) as count  
          FROM publish_history where type=0 and create_time >= ? and  create_time <= ?
          GROUP BY DATE_FORMAT( create_time, "%Y-%m-%d" ) order by create_time;`

	counts := &[]DeployCount{}
	_, err := Ormer().Raw(sql, startTime, endTime).QueryRows(counts)

	return counts, err
}

func (*publishHistoryModel) GetDeployCountGroupByDayFromNamespace(namespace_id int64, startTime time.Time) (*[]DeployCount, error) {
	sql := `select DATE_FORMAT( a.create_time, "%Y-%m-%d" ) as date, COUNT( * ) as count from publish_history a inner join
          deployment b on a.resource_id=b.id inner join app c on b.app_id=c.id
          where a.type=0 and c.namespace_id=? and a.create_time >= ? GROUP BY DATE_FORMAT( a.create_time, "%Y-%m-%d" ) order by a.create_time;`

	counts := &[]DeployCount{}
	_, err := Ormer().Raw(sql, namespace_id, startTime).QueryRows(counts)

	return counts, err
}
