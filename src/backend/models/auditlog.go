package models

import (
	"time"
)

const (
	TableNameAuditLog = "audit_log"
)

type auditLogModel struct{}

type AuditLogLevel string

type AuditLogType string

const (
	AuditLogLevelNormal   AuditLogLevel = "Normal"
	AuditLogLevelWarning  AuditLogLevel = "Warning"
	AuditLogLevelCritical AuditLogLevel = "Critical"

	// CURD
	AuditLogTypeUnknown AuditLogType = "Unknown"
	AuditLogTypeCreate  AuditLogType = "Create"
	AuditLogTypeUpdate  AuditLogType = "Update"
	AuditLogTypeRead    AuditLogType = "Read"
	AuditLogTypeDelete  AuditLogType = "Delete"
)

type AuditLog struct {
	Id         int64         `orm:"auto" json:"id,omitempty"`
	SubjectId  int64         `orm:"type(bigint)" json:"subjectId,omitempty"`
	LogType    AuditLogType  `orm:"index;size(128)" json:"logType,omitempty"`
	LogLevel   AuditLogLevel `orm:"index;size(128)" json:"logLevel,omitempty"`
	Action     string        `orm:"index;size(255)" json:"action,omitempty"`
	Message    string        `orm:"type(text);null" json:"message,omitempty"`
	UserIp     string        `orm:"size(200)" json:"userIp,omitempty"`
	User       string        `orm:"index;size(128)" json:"user,omitempty"`
	CreateTime *time.Time    `orm:"auto_now_add;type(datetime);null" json:"createTime,omitempty"`
}

func (*AuditLog) TableName() string {
	return TableNameAuditLog
}

func (*auditLogModel) Add(m *AuditLog) (id int64, err error) {
	id, err = Ormer().Insert(m)
	if err != nil {
		return
	}
	return
}
