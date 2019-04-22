import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AppModule } from './app/app.module';
import { SharedModule } from '../shared/shared.module';
import { DeploymentModule } from './deployment/deployment.module';
import { DeploymentTplModule } from './deploymenttpl/deploymenttpl.module';
import { ClusterModule } from './cluster/cluster.module';
import { NamespaceModule } from './namespace/namespace.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { PermissionModule } from './permission/permission.module';
import { SecretModule } from './secret/secret.module';
import { SecrettplModule } from './secrettpl/secrettpl.module';
import { ConfigMapModule } from './configmap/configmap.module';
import { ConfigMapTplModule } from './configmaptpl/configmaptpl.module';
import { CronjobModule } from './cronjob/cronjob.module';
import { CronjobTplModule } from './cronjobtpl/cronjobtpl.module';
import { AuthService } from '../shared/auth/auth.service';
import { AdminAuthCheckGuard } from '../shared/auth/admin-auth-check-guard.service';
import { PersistentVolumeModule } from './kubernetes/persistentvolume/persistentvolume.module';
import { PersistentVolumeClaimModule } from './persistentvolumeclaim/persistentvolumeclaim.module';
import { PersistentVolumeClaimTplModule } from './persistentvolumeclaimtpl/persistentvolumeclaimtpl.module';
import { AuditLogModule } from './auditlog/auditlog.module';
import { ApiKeyModule } from './apikey/apikey.module';
import { ReportFormModule } from './reportform/reportform.module';
import { DaemonsetModule } from './daemonset/daemonset.module';
import { DaemonsettplModule } from './daemonsettpl/daemonsettpl.module';
import { StatefulsetModule } from './statefulset/statefulset.module';
import { StatefulsettplModule } from './statefulsettpl/statefulsettpl.module';
import { ConfigModule } from './config/config.module';
import { KubernetesDashboardModule } from './kubernetes/dashboard/dashboard.module';
import { NavModule } from './nav/nav.module';
import { NotificationModule } from './notification/notification.module';
import { NodesModule } from './kubernetes/node/nodes.module';
import { LibraryAdminModule } from '../../../lib/admin/library-admin.module';
import { IngressModule } from './ingress/ingress.module';
import { IngressTplModule } from './ingresstpl/ingresstpl.module';
import { KubeDeploymentModule } from './kubernetes/deployment/kube-deployment.module';
import { TplDetailModule } from '../shared/tpl-detail/tpl-detail.module';
import { KubeNamespaceModule } from './kubernetes/namespace/kube-namespace.module';
import { AutoscaleComponent } from './autoscale/autoscale.component';
import { AutoscaletplComponent } from './autoscaletpl/autoscaletpl.component';
import { CreateEditAutoscaleComponent } from './autoscale/create-edit-autoscale/create-edit-autoscale.component';
import { ListAutoscaleComponent } from './autoscale/list-autoscale/list-autoscale.component';
import { TrashAutoscaleComponent } from './autoscale/trash-autoscale/trash-autoscale.component';
import { CreateEditAutoscaletplComponent } from './autoscaletpl/create-edit-autoscaletpl/create-edit-autoscaletpl.component';
import { ListAutoscaletplComponent } from './autoscaletpl/list-autoscaletpl/list-autoscaletpl.component';
import { TrashAutoscaletplComponent } from './autoscaletpl/trash-autoscaletpl/trash-autoscaletpl.component';
import { SidenavModule } from './sidenav/sidenav.module';
import { KubePodModule } from './kubernetes/pod/kube-pod.module';
import { KubeServiceModule } from './kubernetes/service/kube-service.module';
import { KubeEndpointModule } from './kubernetes/endpoint/kube-endpoint.module';
import { KubeConfigmapModule } from './kubernetes/configmap/kube-configmap.module';
import { KubeSecretModule } from './kubernetes/secret/kube-secret.module';
import { KubeIngressModule } from './kubernetes/ingress/kube-ingress.module';
import { KubeStatefulsetModule } from './kubernetes/statefulset/kube-statefulset.module';
import { KubeDaemonsetModule } from './kubernetes/daemonset/kube-daemonset.module';
import { KubeCronjobModule } from './kubernetes/cronjob/kube-cronjob.module';
import { KubeJobModule } from './kubernetes/job/kube-job.module';
import { KubeReplicasetModule } from './kubernetes/replicaset/kube-replicaset.module';
import { KubePvcModule } from './kubernetes/pvc/kube-pvc.module';
import { KubeStorageclassModule } from './kubernetes/storageclass/kube-storageclass.module';
import { KubeHpaModule } from './kubernetes/hpa/kube-hpa.module';
import { KubeRoleModule } from './kubernetes/role/kube-role.module';
import { KubeRolebindingModule } from './kubernetes/rolebinding/kube-rolebinding.module';
import { KubeServiceaccountModule } from './kubernetes/serviceaccount/kube-serviceaccount.module';
import { KubeClusterroleModule } from './kubernetes/clusterrole/kube-clusterrole.module';
import { KubeClusterrolebindingModule } from './kubernetes/clusterrolebinding/kube-clusterrolebinding.module';
import { KubeCrdModule } from './kubernetes/crd/kube-crd.module';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    ClusterModule,
    AppModule,
    DeploymentModule,
    DeploymentTplModule,
    NamespaceModule,
    UserModule,
    GroupModule,
    PermissionModule,
    SecretModule,
    SecrettplModule,
    ConfigMapModule,
    ConfigMapTplModule,
    CronjobModule,
    CronjobTplModule,
    PersistentVolumeModule,
    PersistentVolumeClaimModule,
    PersistentVolumeClaimTplModule,
    AuditLogModule,
    ApiKeyModule,
    ReportFormModule,
    DaemonsetModule,
    DaemonsettplModule,
    StatefulsetModule,
    StatefulsettplModule,
    ConfigModule,
    KubernetesDashboardModule,
    NavModule,
    NotificationModule,
    NodesModule,
    KubeNamespaceModule,
    LibraryAdminModule,
    IngressModule,
    IngressTplModule,
    KubeDeploymentModule,
    TplDetailModule,
    SidenavModule,
    KubePodModule,
    KubeServiceModule,
    KubeEndpointModule,
    KubeConfigmapModule,
    KubeSecretModule,
    KubeIngressModule,
    KubeStatefulsetModule,
    KubeDaemonsetModule,
    KubeCronjobModule,
    KubeJobModule,
    KubeReplicasetModule,
    KubeJobModule,
    KubePvcModule,
    KubeStorageclassModule,
    KubeHpaModule,
    KubeRoleModule,
    KubeRolebindingModule,
    KubeServiceaccountModule,
    KubeClusterroleModule,
    KubeClusterrolebindingModule,
    KubeNamespaceModule,
    KubeCrdModule
  ],
  providers: [
    AdminAuthCheckGuard,
    AuthService
  ],
  declarations: [AdminComponent, AutoscaleComponent, AutoscaletplComponent,
    CreateEditAutoscaleComponent, ListAutoscaleComponent, TrashAutoscaleComponent,
    CreateEditAutoscaletplComponent, ListAutoscaletplComponent, TrashAutoscaletplComponent]
})
export class AdminModule {
}
