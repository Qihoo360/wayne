package models

import (
	"github.com/astaxie/beego/orm"

	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

const (
	PublishTypeDeployment PublishType = iota
	PublishTypeService
	PublishTypeConfigMap
	PublishTypeSecret
	PublishTypePersistentVolumeClaim
	PublishTypeCronJob
	PublishTypeStatefulSet
	PublishTypeDaemonSet
	PublishTypeIngress
	PublishTypeHPA

	TableNamePublishStatus = "publish_status"
)

type publishStatusModel struct{}

type PublishType int32

// 记录已发布模版信息
type PublishStatus struct {
	Id         int64       `orm:"auto" json:"id,omitempty"`
	Type       PublishType `orm:"index;type(integer)" json:"type,omitempty"`
	ResourceId int64       `orm:"index;column(resource_id)" json:"resourceId,omitempty"`
	TemplateId int64       `orm:"index;column(template_id);" json:"templateId,omitempty"`
	Cluster    string      `orm:"size(128);column(cluster)" json:"cluster,omitempty"`
}

func (*PublishStatus) TableName() string {
	return TableNamePublishStatus
}

func (*publishStatusModel) GetAll(publishType PublishType, resourceId int64) (publishStatus []PublishStatus, err error) {
	_, err = Ormer().
		QueryTable(new(PublishStatus)).
		Filter("ResourceId", resourceId).
		Filter("Type", publishType).
		All(&publishStatus)
	return
}

func (*publishStatusModel) GetByCluster(publishType PublishType, resourceId int64, cluster string) (publishStatus PublishStatus, err error) {
	err = Ormer().
		QueryTable(new(PublishStatus)).
		Filter("ResourceId", resourceId).
		Filter("Type", publishType).
		Filter("Cluster", cluster).
		One(&publishStatus)
	return
}

func (*publishStatusModel) Publish(m *PublishStatus) error {
	o := orm.NewOrm()
	qs := o.QueryTable(new(PublishStatus))
	err := o.Begin()
	if err != nil {
		logs.Error("(%v) begin transaction error.%v", m, err)
		return err
	}
	publishStatus := []PublishStatus{}
	count, err := qs.Filter("ResourceId", m.ResourceId).
		Filter("Type", m.Type).
		All(&publishStatus)
	if err != nil {
		return err
	}
	// 该资源未发布过
	if count == 0 {
		_, err := o.Insert(m)
		transactionError := o.Commit()
		if transactionError != nil {
			logs.Error("(%v) commit transaction error.%v", m, err)
		}
		return err
	}

	for _, state := range publishStatus {
		if state.Cluster == m.Cluster {
			// 模版已经发布过，不做任何操作
			if state.TemplateId == m.TemplateId {
				return nil
			} else { // 改集群已经被其他模版发布过，需要先删除原来记录
				_, err := o.Delete(&state)
				if err != nil {
					return err
				}

				_, err = o.Insert(m)
				if err != nil {
					transactionError := o.Rollback()
					if transactionError != nil {
						logs.Error("(%v) rollback transaction error.%v", m, err)
					}
					return err
				}
				transactionError := o.Commit()
				if transactionError != nil {
					logs.Error("(%v) commit transaction error.%v", m, err)
				}
				return err
			}
		}
	}
	// 未找到已发布的机房，可以直接发布
	_, err = o.Insert(m)
	transactionError := o.Commit()
	if transactionError != nil {
		logs.Error("(%v) commit transaction error.%v", m, err)
	}
	return err
}

func (*publishStatusModel) DeleteById(id int64) (err error) {
	v := PublishStatus{Id: id}
	// ascertain id exists in the database
	if err = Ormer().Read(&v); err == nil {
		_, err = Ormer().Delete(&v)
		return err
	}
	return
}

func (p *publishStatusModel) Add(id int64, tplId int64, cluster string, publishType PublishType) error {
	// 添加发布状态
	publishStatus := PublishStatus{
		ResourceId: id,
		TemplateId: tplId,
		Type:       publishType,
		Cluster:    cluster,
	}
	err := p.Publish(&publishStatus)
	if err != nil {
		logs.Error("publish publishStatus (%v) to db error.%v", publishStatus, err)
		return err
	}
	return nil
}
