// @APIVersion 1.0.0
// @Title Wayne API
// @Description List接口查询技巧：<br> 1.按照字段排序：增加sortby查询参数。例如：sortby=-id ，负号表示倒叙排序，不加负号表示默认排序 <br> 2.按照字段查询：增加filter查询参数。例如：filter=name__exact=test 表示name名称等于test， filter=name__contains=test表示名称包含test
package routers

import (
	"net/http"
	"path"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context"

	"github.com/Qihoo360/wayne/src/backend/controllers"
	"github.com/Qihoo360/wayne/src/backend/controllers/apikey"
	"github.com/Qihoo360/wayne/src/backend/controllers/app"
	"github.com/Qihoo360/wayne/src/backend/controllers/appstarred"
	"github.com/Qihoo360/wayne/src/backend/controllers/auditlog"
	"github.com/Qihoo360/wayne/src/backend/controllers/auth"
	"github.com/Qihoo360/wayne/src/backend/controllers/bill"
	"github.com/Qihoo360/wayne/src/backend/controllers/cluster"
	"github.com/Qihoo360/wayne/src/backend/controllers/config"
	"github.com/Qihoo360/wayne/src/backend/controllers/configmap"
	"github.com/Qihoo360/wayne/src/backend/controllers/cronjob"
	"github.com/Qihoo360/wayne/src/backend/controllers/daemonset"
	"github.com/Qihoo360/wayne/src/backend/controllers/deployment"
	"github.com/Qihoo360/wayne/src/backend/controllers/hpa"
	"github.com/Qihoo360/wayne/src/backend/controllers/ingress"
	kconfigmap "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/configmap"
	kcronjob "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/cronjob"
	kdaemonset "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/daemonset"
	kdeployment "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/deployment"
	kevent "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/event"
	khpa "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/hpa"
	kingress "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/ingress"
	kjob "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/job"
	klog "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/log"
	knamespace "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/namespace"
	knode "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/node"
	kpod "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pod"
	"github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/proxy"
	kpv "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pv"
	kpvc "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/pvc"
	ksecret "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/secret"
	kservice "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/service"
	kstatefulset "github.com/Qihoo360/wayne/src/backend/controllers/kubernetes/statefulset"
	"github.com/Qihoo360/wayne/src/backend/controllers/namespace"
	"github.com/Qihoo360/wayne/src/backend/controllers/notification"
	"github.com/Qihoo360/wayne/src/backend/controllers/openapi"
	"github.com/Qihoo360/wayne/src/backend/controllers/permission"
	"github.com/Qihoo360/wayne/src/backend/controllers/publish"
	"github.com/Qihoo360/wayne/src/backend/controllers/publishstatus"
	"github.com/Qihoo360/wayne/src/backend/controllers/pvc"
	"github.com/Qihoo360/wayne/src/backend/controllers/secret"
	"github.com/Qihoo360/wayne/src/backend/controllers/statefulset"
	"github.com/Qihoo360/wayne/src/backend/controllers/webhook"
	"github.com/Qihoo360/wayne/src/backend/health"
	_ "github.com/Qihoo360/wayne/src/backend/plugins"
	"github.com/Qihoo360/wayne/src/backend/util/hack"
)

func init() {
	// Beego注解路由代码生成规则和程序运行路径相关，需要改写一下避免产生不一致的文件名
	if beego.BConfig.RunMode == "dev" && path.Base(beego.AppPath) == "_build" {
		beego.AppPath = path.Join(path.Dir(beego.AppPath), "src/backend")
	}

	beego.Handler("/ws/pods/exec", kpod.CreateAttachHandler("/ws/pods/exec"), true)

	beego.Get("/healthz", func(ctx *context.Context) {
		dc := health.DatabaseCheck{}
		err := dc.Check()
		if err != nil {
			ctx.Output.SetStatus(http.StatusInternalServerError)
			ctx.Output.Body(hack.Slice(err.Error()))
			return
		}
		ctx.Output.SetStatus(http.StatusOK)
		ctx.Output.Body(hack.Slice("ok"))
	})

	beego.Include(&auth.AuthController{})

	nsWithApp := beego.NewNamespace("/api/v1",
		// 路由中携带appid
		beego.NSNamespace("/apps/:appid([0-9]+)/users",
			beego.NSInclude(
				&permission.AppUserController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/configmaps",
			beego.NSInclude(
				&configmap.ConfigMapController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/configmaps/tpls",
			beego.NSInclude(
				&configmap.ConfigMapTplController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/cronjobs",
			beego.NSInclude(
				&cronjob.CronjobController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/cronjobs/tpls",
			beego.NSInclude(
				&cronjob.CronjobTplController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/deployments",
			beego.NSInclude(
				&deployment.DeploymentController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/deployments/tpls",
			beego.NSInclude(
				&deployment.DeploymentTplController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/statefulsets",
			beego.NSInclude(
				&statefulset.StatefulsetController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/statefulsets/tpls",
			beego.NSInclude(
				&statefulset.StatefulsetTplController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/daemonsets",
			beego.NSInclude(
				&daemonset.DaemonSetController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/daemonsets/tpls",
			beego.NSInclude(
				&daemonset.DaemonSetTplController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/persistentvolumeclaims",
			beego.NSInclude(
				&pvc.PersistentVolumeClaimController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/persistentvolumeclaims/tpls",
			beego.NSInclude(
				&pvc.PersistentVolumeClaimTplController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/secrets",
			beego.NSInclude(
				&secret.SecretController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/secrets/tpls",
			beego.NSInclude(
				&secret.SecretTplController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/webhooks",
			beego.NSInclude(
				&webhook.WebHookController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/apikeys",
			beego.NSInclude(
				&apikey.ApiKeyController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/ingresses",
			beego.NSInclude(
				&ingress.IngressController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/ingresses/tpls",
			beego.NSInclude(
				&ingress.IngressTplController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/hpas",
			beego.NSInclude(
				&hpa.HPAController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/hpas/tpls",
			beego.NSInclude(
				&hpa.HPATplController{},
			),
		),
	)

	nsWithKubernetes := beego.NewNamespace("/api/v1",
		beego.NSRouter("/kubernetes/pods/statistics", &kpod.KubePodController{}, "get:PodStatistics"),

		beego.NSNamespace("/kubernetes/persistentvolumes",
			beego.NSInclude(
				&kpv.KubePersistentVolumeController{},
			),
		),
		beego.NSNamespace("/kubernetes/persistentvolumes/robin",
			beego.NSInclude(
				&kpv.RobinPersistentVolumeController{},
			),
		),
		beego.NSNamespace("/kubernetes/namespaces",
			beego.NSInclude(
				&knamespace.KubeNamespaceController{},
			),
		),
		beego.NSNamespace("/kubernetes/nodes",
			beego.NSInclude(
				&knode.KubeNodeController{},
			),
		),
	)

	nsWithKubernetesApp := beego.NewNamespace("/api/v1",
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/cronjobs",
			beego.NSInclude(
				&kcronjob.KubeCronjobController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/deployments",
			beego.NSInclude(
				&kdeployment.KubeDeploymentController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/statefulsets",
			beego.NSInclude(
				&kstatefulset.KubeStatefulsetController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/daemonsets",
			beego.NSInclude(
				&kdaemonset.KubeDaemonSetController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/configmaps",
			beego.NSInclude(
				&kconfigmap.KubeConfigMapController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/services",
			beego.NSInclude(
				&kservice.KubeServiceController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/ingresses",
			beego.NSInclude(
				&kingress.KubeIngressController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/hpas",
			beego.NSInclude(
				&khpa.KubeHPAController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/secrets",
			beego.NSInclude(
				&ksecret.KubeSecretController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/persistentvolumeclaims",
			beego.NSInclude(
				&kpvc.KubePersistentVolumeClaimController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/persistentvolumeclaims/robin",
			beego.NSInclude(
				&kpvc.RobinPersistentVolumeClaimController{},
			),
		),

		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/jobs",
			beego.NSInclude(
				&kjob.KubeJobController{},
			),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/pods",
			beego.NSInclude(
				&kpod.KubePodController{}),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/events",
			beego.NSInclude(
				&kevent.KubeEventController{}),
		),
		beego.NSNamespace("/kubernetes/apps/:appid([0-9]+)/podlogs",
			beego.NSInclude(
				&klog.KubeLogController{}),
		),
	)

	nsWithNamespace := beego.NewNamespace("/api/v1",
		// 路由中携带namespaceid
		beego.NSNamespace("/namespaces/:namespaceid([0-9]+)/apps",
			beego.NSInclude(
				&app.AppController{},
			),
		),
		beego.NSNamespace("/namespaces/:namespaceid([0-9]+)/webhooks",
			beego.NSInclude(
				&webhook.WebHookController{},
			),
		),
		beego.NSNamespace("/namespaces/:namespaceid([0-9]+)/apikeys",
			beego.NSInclude(
				&apikey.ApiKeyController{},
			),
		),
		beego.NSNamespace("/namespaces/:namespaceid([0-9]+)/users",
			beego.NSInclude(
				&permission.NamespaceUserController{},
			),
		),
		beego.NSNamespace("/namespaces/:namespaceid([0-9]+)/bills",
			beego.NSInclude(
				&bill.BillController{},
			),
		),
	)

	nsWithoutApp := beego.NewNamespace("/api/v1",
		// 路由中不携带任何id
		beego.NSNamespace("/configs",
			beego.NSInclude(
				&config.ConfigController{},
			),
		),
		beego.NSNamespace("/configs/base",
			beego.NSInclude(
				&config.BaseConfigController{},
			),
		),
		beego.NSRouter("/apps/statistics", &app.AppController{}, "get:AppStatistics"),
		beego.NSNamespace("/clusters",
			beego.NSInclude(
				&cluster.ClusterController{},
			),
		),
		beego.NSNamespace("/auditlogs",
			beego.NSInclude(
				&auditlog.AuditLogController{},
			),
		),
		beego.NSNamespace("/notifications",
			beego.NSInclude(
				&notification.NotificationController{},
			),
		),
		beego.NSNamespace("/namespaces",
			beego.NSInclude(
				&namespace.NamespaceController{},
			),
		),
		beego.NSNamespace("/apps/stars",
			beego.NSInclude(
				&appstarred.AppStarredController{},
			),
		),
		beego.NSNamespace("/publish",
			beego.NSInclude(
				&publish.PublishController{},
			),
		),
		beego.NSNamespace("/publishstatus",
			beego.NSInclude(
				&publishstatus.PublishStatusController{},
			),
		),
		beego.NSNamespace("/users",
			beego.NSInclude(
				&permission.UserController{}),
		),
		beego.NSNamespace("/groups",
			beego.NSInclude(
				&permission.GroupController{},
			),
		),
		beego.NSNamespace("/permissions",
			beego.NSInclude(
				&permission.PermissionController{},
			),
		),
	)

	nsWithOpenAPI := beego.NewNamespace("/openapi/v1",
		beego.NSNamespace("/gateway/action",
			beego.NSInclude(
				&openapi.OpenAPIController{}),
		),
	)

	// For Kubernetes resource router
	// appid used to check permission
	nsWithKubernetesProxy := beego.NewNamespace("/api/v1",
		beego.NSNamespace("/apps/:appid([0-9]+)/_proxy/clusters/:cluster/namespaces/:namespace/:kind",
			beego.NSInclude(
				&proxy.KubeProxyController{},
			),
		),
		beego.NSNamespace("/apps/:appid([0-9]+)/_proxy/clusters/:cluster/:kind",
			beego.NSInclude(
				&proxy.KubeProxyController{},
			),
		),
	)

	beego.AddNamespace(nsWithKubernetes)

	beego.AddNamespace(nsWithKubernetesApp)

	beego.AddNamespace(nsWithApp)

	beego.AddNamespace(nsWithoutApp)

	beego.AddNamespace(nsWithNamespace)

	beego.AddNamespace(nsWithOpenAPI)

	beego.AddNamespace(nsWithKubernetesProxy)

	beego.Router("/*", &controllers.IndexController{})

}
