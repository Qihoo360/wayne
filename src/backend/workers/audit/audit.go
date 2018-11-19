package audit

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strings"
	"sync"

	"github.com/Qihoo360/wayne/src/backend/bus"
	"github.com/Qihoo360/wayne/src/backend/bus/message"
	"github.com/Qihoo360/wayne/src/backend/controllers/openapi"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/workers"
)

const QueueAudit = "audit"

var (
	lock          sync.Mutex
	queueDeclared = false
)

type AuditWorker struct {
	*workers.BaseMessageWorker
}

var _ workers.Worker = &AuditWorker{}

func NewAuditWorker(b *bus.Bus) (*AuditWorker, error) {
	baseWorker := workers.NewBaseMessageWorker(b, QueueAudit)
	w := &AuditWorker{baseWorker}
	w.BaseMessageWorker.MessageWorker = w

	lock.Lock()
	defer lock.Unlock()
	if !queueDeclared {
		if _, err := w.Bus.Channel.QueueDeclare(QueueAudit, true, false, false, false, nil); err != nil {
			return nil, err
		}
		if err := w.Bus.Channel.QueueBind(QueueAudit, bus.RoutingKeyRequest, w.Bus.Name, false, nil); err != nil {
			return nil, err
		}
		w.Bus.Channel.Qos(1, 0, false)
		queueDeclared = true
	}

	return w, nil
}

func (w *AuditWorker) Process(msg *message.Message) error {
	var data *message.RequestMessageData
	switch msg.Type {
	case message.TypeRequest:
		if err := json.Unmarshal(msg.Data, &data); err != nil {
			return err
		}
	default:
		return nil // 不处理其他类型数据
	}

	var auditor Auditor
	switch data.Controller {
	case "NamespaceUserController":
		auditor = NamespaceUserAuditor{}
	case "AppUserController":
		auditor = AppAuditor{}
	case "OpenAPIController":
		auditor = OpenAPIAuditor{}
	default:
		auditor = FallbackRequestAuditor{}
	}

	if auditor != nil {
		return auditor.Audit(data)
	}
	return nil
}

type Auditor interface {
	Audit(*message.RequestMessageData) error
}

type NamespaceUserAuditor struct {
}

var _ Auditor = NamespaceUserAuditor{}

func (a NamespaceUserAuditor) Audit(data *message.RequestMessageData) error {
	var namespaceUser models.NamespaceUser
	var noResponseBody = false
	if string(data.ResponseBody) == "null" { // DELETE method has no body
		noResponseBody = true
	} else if err := json.Unmarshal(data.ResponseBody, &namespaceUser); err != nil {
		logs.Error(err)
		return err
	}

	var userId int64
	var userName, namespaceName, groupsName string
	if !noResponseBody && namespaceUser.Id != 0 {
		userId = namespaceUser.Id
		userName = namespaceUser.User.Name
		namespaceName = namespaceUser.Namespace.String()

		groups := make([]string, 0)
		for _, group := range namespaceUser.Groups {
			groups = append(groups, group.String())
		}
		groupsName = strings.Join(groups, ",")
	}

	log := models.AuditLog{
		SubjectId: userId,
		LogType:   models.AuditLogTypeUnknown,
		LogLevel:  models.AuditLogLevelNormal,
		Action:    fmt.Sprintf("%s:%s", data.Controller, data.Method),
		UserIp:    data.IP,
		User:      data.User,
	}

	// Controller methods(controllers/permission/namespace_user.go)
	switch data.Method {
	case "Create":
		log.LogType = models.AuditLogTypeCreate
		log.Message = fmt.Sprintf(
			"授权用户（%s）部门（%s）权限（%v）",
			userName,
			namespaceName,
			groupsName,
		)
	case "Update":
		log.LogType = models.AuditLogTypeUpdate
		log.Message = fmt.Sprintf(
			"更新用户（%s）部门（%s）权限（%v）",
			userName,
			namespaceName,
			groupsName,
		)
	case "Delete":
		log.LogType = models.AuditLogTypeDelete
		log.LogLevel = models.AuditLogLevelWarning
		log.Message = fmt.Sprintf("删除部门用户（%s）", data.URI)
	}

	_, err := models.AuditLogModel.Add(&log)
	return err
}

type AppAuditor struct {
}

var _ Auditor = AppAuditor{}

func (a AppAuditor) Audit(data *message.RequestMessageData) error {
	var appUser models.AppUser
	var noResponseBody = false
	if string(data.ResponseBody) == "null" { // DELETE method has no body
		noResponseBody = true
	} else if err := json.Unmarshal(data.ResponseBody, &appUser); err != nil {
		logs.Error(err)
		return err
	}

	var userId int64
	var userName, appName, groupsName string
	if !noResponseBody && appUser.Id != 0 {
		userId = appUser.Id
		userName = appUser.User.Name
		appName = appUser.App.String()

		groups := make([]string, 0)
		for _, group := range appUser.Groups {
			groups = append(groups, group.String())
		}
		groupsName = strings.Join(groups, ",")
	}

	log := models.AuditLog{
		SubjectId: userId,
		LogType:   models.AuditLogTypeUnknown,
		LogLevel:  models.AuditLogLevelNormal,
		Action:    fmt.Sprintf("%s:%s", data.Controller, data.Method),
		UserIp:    data.IP,
		User:      data.User,
	}

	// Controller methods(controllers/permission/app_user.go)
	switch data.Method {
	case "Create":
		log.LogType = models.AuditLogTypeCreate
		log.Message = fmt.Sprintf(
			"授权用户（%s）项目（%s）权限（%v）",
			userName,
			appName,
			groupsName,
		)
	case "Update":
		log.LogType = models.AuditLogTypeUpdate
		log.Message = fmt.Sprintf(
			"更新用户（%s）项目（%s）权限（%v）",
			userName,
			appName,
			groupsName,
		)
	case "Delete":
		log.LogType = models.AuditLogTypeDelete
		log.LogLevel = models.AuditLogLevelWarning
		log.Message = fmt.Sprintf("删除项目用户（%s）", data.URI)
	}

	_, err := models.AuditLogModel.Add(&log)
	return err
}

type OpenAPIAuditor struct{}

var _ Auditor = OpenAPIAuditor{}

func (a OpenAPIAuditor) Audit(data *message.RequestMessageData) error {
	var msg string
	var logType models.AuditLogType
	u, err := url.ParseRequestURI(data.URI)
	if err != nil {
		msg = err.Error()
	} else {
		qs := u.Query()
		apiAction := qs.Get("action")
		switch apiAction {
		case openapi.GetPodInfoAction:
			logType = models.AuditLogTypeRead
			msg = fmt.Sprintf("Action: %s\nSelector: %s", apiAction, qs.Get("labelSelector"))
		case openapi.GetDeploymentStatusAction:
			logType = models.AuditLogTypeRead
			msg = fmt.Sprintf("Action: %s\nDeployment: [%s]%s:%s",
				apiAction, qs.Get("namespace"), qs.Get("deployment"), qs.Get("cluster"))
		case openapi.UpgradeDeploymentAction:
			logType = models.AuditLogTypeUpdate
			msg = fmt.Sprintf("Action: %s\nDeployment: [%s]%s:%s\nImage: %s",
				apiAction, qs.Get("namespace"), qs.Get("deployment"), qs.Get("cluster"), qs.Get("images"))
		case openapi.ScaleDeploymentAction:
			logType = models.AuditLogTypeUpdate
			msg = fmt.Sprintf("Action: %s\nDeployment: [%s]%s:%s",
				apiAction, qs.Get("namespace"), qs.Get("deployment"), qs.Get("cluster"))
		default:
			msg = fmt.Sprintf("Action: %s", apiAction)
		}
	}

	log := models.AuditLog{
		LogType:  logType,
		LogLevel: models.AuditLogLevelNormal,
		Action:   fmt.Sprintf("%s:%s", data.Controller, data.Method),
		UserIp:   data.IP,
		User:     data.User,
		Message:  msg,
	}

	_, err = models.AuditLogModel.Add(&log)
	return err
}

type FallbackRequestAuditor struct{}

var _ Auditor = FallbackRequestAuditor{}

func (a FallbackRequestAuditor) Audit(data *message.RequestMessageData) error {
	// 如果URLMapping中删除操作没有声明为Delete，那审计时无法判断是否需要默认记录该行为
	if data.Method != "Delete" {
		return nil
	}

	log := models.AuditLog{
		LogType:  models.AuditLogTypeDelete,
		LogLevel: models.AuditLogLevelWarning,
		Action:   fmt.Sprintf("%s:%s", data.Controller, data.Method),
		UserIp:   data.IP,
		User:     data.User,
		Message:  data.URI,
	}

	_, err := models.AuditLogModel.Add(&log)
	return err
}
