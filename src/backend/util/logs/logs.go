package logs

import (
	"fmt"
	"strings"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/getsentry/raven-go"
)

var (
	logger = logs.NewLogger(10000)

	sentryClient   *raven.Client
	sentryLogLevel = logs.LevelInfo
)

func init() {
	logLevel := beego.AppConfig.DefaultInt("LogLevel", 4)
	logger.SetLogger(logs.AdapterConsole, fmt.Sprintf(`{"level":%d}`, logLevel))
	logger.EnableFuncCallDepth(true)
	logger.SetLogFuncCallDepth(3)

	sentryEnable := beego.AppConfig.DefaultBool("SentryEnable", false)
	if sentryEnable {
		sentryLogLevel = beego.AppConfig.DefaultInt("SentryLogLevel", 4)
		dsn := beego.AppConfig.String("SentryDSN")
		var err error
		sentryClient, err = raven.New(dsn)
		if err != nil {
			logs.Error(err)
		} else {
			//sentryClient.SetRelease("")
			//sentryClient.SetEnvironment("")
		}
	}
}

func sentryLog(severity raven.Severity, f interface{}, v ...interface{}) string {
	tags := map[string]string{}

	var packet *raven.Packet
	switch rval := f.(type) {
	case error:
		packet = raven.NewPacket(rval.Error(), raven.NewException(rval, raven.GetOrNewStacktrace(rval, 2, 5, nil)))
	default:
		message := formatLog(rval, v...)
		packet = raven.NewPacket(message, &raven.Message{message, nil})
	}
	packet.Level = severity

	eventID, _ := sentryClient.Capture(packet, tags)
	return eventID
}

func Error(f interface{}, v ...interface{}) {
	logs.Error(formatLog(f, v...))
	if sentryClient != nil && sentryLogLevel >= logs.LevelError {
		sentryLog(raven.ERROR, f, v...)
	}
	return
}

func Warning(f interface{}, v ...interface{}) {
	logger.Warning(formatLog(f, v...))
	if sentryClient != nil && sentryLogLevel >= logs.LevelWarning {
		sentryLog(raven.WARNING, f, v...)
	}
	return
}

func Critical(f interface{}, v ...interface{}) {
	logger.Critical(formatLog(f, v...))
	if sentryClient != nil && sentryLogLevel >= logs.LevelCritical {
		sentryLog(raven.FATAL, f, v...)
	}
	return
}

func Notice(f interface{}, v ...interface{}) {
	logger.Notice(formatLog(f, v...))
	if sentryClient != nil && sentryLogLevel >= logs.LevelNotice {
		sentryLog(raven.INFO, f, v...)
	}
	return
}

func Info(f interface{}, v ...interface{}) {
	logger.Info(formatLog(f, v...))
	if sentryClient != nil && sentryLogLevel >= logs.LevelInfo {
		sentryLog(raven.INFO, f, v...)
	}
	return
}

func Debug(f interface{}, v ...interface{}) {
	logger.Debug(formatLog(f, v...))
	if sentryClient != nil && sentryLogLevel >= logs.LevelDebug {
		sentryLog(raven.DEBUG, f, v...)
	}
	return
}

// vendor/github.com/astaxie/beego/logs/log.go
func formatLog(f interface{}, v ...interface{}) string {
	var msg string
	switch f.(type) {
	case string:
		msg = f.(string)
		if len(v) == 0 {
			return msg
		}
		if strings.Contains(msg, "%") && !strings.Contains(msg, "%%") {
			//format string
		} else {
			//do not contain format char
			msg += strings.Repeat(" %v", len(v))
		}
	default:
		msg = fmt.Sprint(f)
		if len(v) == 0 {
			return msg
		}
		msg += strings.Repeat(" %v", len(v))
	}
	return fmt.Sprintf(msg, v...)
}
