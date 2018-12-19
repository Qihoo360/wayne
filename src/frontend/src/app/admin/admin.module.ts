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
    TplDetailModule
  ],
  providers: [
    AdminAuthCheckGuard,
    AuthService
  ],
  declarations: [AdminComponent]
})
export class AdminModule {
}
