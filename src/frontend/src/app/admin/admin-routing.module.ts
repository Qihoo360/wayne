import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DeploymentComponent } from './deployment/deployment.component';
import { AppComponent } from './app/app.component';
import { TrashAppComponent } from './app/trash-app/trash-app.component';
import { TrashDeploymentComponent } from './deployment/trash-deployment/trash-deployment.component';
import { DeploymentTplComponent } from './deploymenttpl/deploymenttpl.component';
import { TrashDeploymentTplComponent } from './deploymenttpl/trash-deploymenttpl/trash-deploymenttpl.component';
import { ClusterComponent } from './cluster/cluster.component';
import { TrashClusterComponent } from './cluster/trash-cluster/trash-cluster.component';
import { NamespaceComponent } from './namespace/namespace.component';
import { UserComponent } from './user/user.component';
import { GroupComponent } from './group/group.component';
import { PermissionComponent } from './permission/permission.component';
import { SecretComponent } from './secret/secret.component';
import { TrashSecretComponent } from './secret/trash-secret/trash-secret.component';
import { SecretTplComponent } from './secrettpl/secrettpl.component';
import { TrashSecretTplComponent } from './secrettpl/trash-secrettpl/trash-secrettpl.component';
import { TrashNamespaceComponent } from './namespace/trash-namespace/trash-namespace.component';
import { ConfigMapComponent } from './configmap/configmap.component';
import { TrashConfigMapComponent } from './configmap/trash-configmap/trash-configmap.component';
import { ConfigMapTplComponent } from './configmaptpl/configmaptpl.component';
import { TrashConfigMapTplComponent } from './configmaptpl/trash-configmaptpl/trash-configmaptpl.component';
import { CronjobComponent } from './cronjob/cronjob.component';
import { TrashCronjobComponent } from './cronjob/trash-cronjob/trash-cronjob.component';
import { CronjobTplComponent } from './cronjobtpl/cronjobtpl.component';
import { TrashCronjobTplComponent } from './cronjobtpl/trash-cronjobtpl/trash-cronjobtpl.component';
import { AdminAuthCheckGuard } from '../shared/auth/admin-auth-check-guard.service';
import { PersistentVolumeComponent } from './kubernetes/persistentvolume/persistentvolume.component';
import { PersistentVolumeClaimComponent } from './persistentvolumeclaim/persistentvolumeclaim.component';
import {
  TrashPersistentVolumeClaimComponent
} from './persistentvolumeclaim/trash-persistentvolumeclaim/trash-persistentvolumeclaim.component';
import { PersistentVolumeClaimTplComponent } from './persistentvolumeclaimtpl/persistentvolumeclaimtpl.component';
import {
  TrashPersistentVolumeClaimTplComponent
} from './persistentvolumeclaimtpl/trash-persistentvolumeclaimtpl/trash-persistentvolumeclaimtpl.component';
import { AuditLogComponent } from './auditlog/auditlog.component';
import {
  CreateEditPersistentVolumeComponent
} from './kubernetes/persistentvolume/create-edit-persistentvolume/create-edit-persistentvolume.component';
import { ApiKeyComponent } from './apikey/apikey.component';
import { AppReportFormComponent } from './reportform/app/app-reportform.component';
import { OverviewComponent } from './reportform/overview/overview.component';
import { DeployComponent } from './reportform/deploy/deploy.component';
import { StatefulsetComponent } from './statefulset/statefulset.component';
import { TrashStatefulsetComponent } from './statefulset/trash-statefulset/trash-statefulset.component';
import { StatefulsettplComponent } from './statefulsettpl/statefulsettpl.component';
import { TrashStatefulsettplComponent } from './statefulsettpl/trash-statefulsettpl/trash-statefulsettpl.component';
import { DaemonsetComponent } from './daemonset/daemonset.component';
import { TrashDaemonsetComponent } from './daemonset/trash-daemonset/trash-daemonset.component';
import { DaemonsettplComponent } from './daemonsettpl/daemonsettpl.component';
import { TrashDaemonsettplComponent } from './daemonsettpl/trash-daemonsettpl/trash-daemonsettpl.component';
import { ConfigComponent } from './config/config.component';
import { ConfigSystemComponent } from './config/list-config-system/config-system.component';
import { KubernetesDashboardComponent } from './kubernetes/dashboard/dashboard.component';
import { NotificationComponent } from './notification/notification.component';
import { NodesComponent } from './kubernetes/node/nodes.component';
import { ADMINROUTES } from '../../../lib/admin/library-routing-admin';
import { IngressComponent } from './ingress/ingress.component';
import { TrashIngressComponent } from './ingress/trash-ingress/trash-ingress.component';
import { IngressTplComponent } from './ingresstpl/ingresstpl.component';
import { TrashIngressTplComponent } from './ingresstpl/trash-ingresstpl/trash-ingresstpl.component';
import { KubeDeploymentComponent } from './kubernetes/deployment/kube-deployment.component';
import {KubeNamespaceComponent} from './kubernetes/namespace/kube-namespace.component';


const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminAuthCheckGuard],
    canActivateChild: [AdminAuthCheckGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'reportform/overview'
      },
      {path: 'reportform/deploy', component: DeployComponent},
      {path: 'reportform/overview', component: OverviewComponent},
      {path: 'reportform/app', component: AppReportFormComponent},
      {path: 'auditlog', component: AuditLogComponent},
      {path: 'notification', component: NotificationComponent},
      {path: 'cluster', component: ClusterComponent},
      {path: 'cluster/trash', component: TrashClusterComponent},
      {path: 'app', component: AppComponent},
      {path: 'app/trash', component: TrashAppComponent},
      {path: 'app/deployment/:aid', component: DeploymentComponent},
      {path: 'app/secret/:aid', component: SecretComponent},
      {path: 'app/configmap/:aid', component: ConfigMapComponent},
      {path: 'app/cronjob/:aid', component: CronjobComponent},
      {path: 'deployment', component: DeploymentComponent},
      {path: 'deployment/app/:aid', component: AppComponent},
      {path: 'deployment/trash', component: TrashDeploymentComponent},
      {path: 'deployment/relate-tpl/:did', component: DeploymentTplComponent},
      {path: 'deployment/tpl', component: DeploymentTplComponent},
      {path: 'deployment/tpl/trash', component: TrashDeploymentTplComponent},
      {path: 'namespace', component: NamespaceComponent},
      {path: 'namespace/trash', component: TrashNamespaceComponent},
      {path: 'namespace/app/:nid', component: AppComponent},
      {path: 'configmap', component: ConfigMapComponent},
      {path: 'configmap/app/:aid', component: AppComponent},
      {path: 'configmap/trash', component: TrashConfigMapComponent},
      {path: 'configmap/relate-tpl/:cid', component: ConfigMapTplComponent},
      {path: 'configmap/tpl', component: ConfigMapTplComponent},
      {path: 'configmap/tpl/trash', component: TrashConfigMapTplComponent},
      {path: 'cronjob', component: CronjobComponent},
      {path: 'cronjob/app/:aid', component: AppComponent},
      {path: 'cronjob/trash', component: TrashCronjobComponent},
      {path: 'cronjob/relate-tpl/:cid', component: CronjobTplComponent},
      {path: 'cronjob/tpl', component: CronjobTplComponent},
      {path: 'cronjob/tpl/trash', component: TrashCronjobTplComponent},
      {path: 'system/user', component: UserComponent},
      {path: 'system/user/:gid', component: UserComponent},
      {path: 'system/group', component: GroupComponent},
      {path: 'system/permission', component: PermissionComponent},
      {path: 'secret', component: SecretComponent},
      {path: 'secret/app/:aid', component: AppComponent},
      {path: 'secret/trash', component: TrashSecretComponent},
      {path: 'secret/relate-tpl/:sid', component: SecretTplComponent},
      {path: 'secret/tpl', component: SecretTplComponent},
      {path: 'secret/tpl/trash', component: TrashSecretTplComponent},
      {path: 'persistentvolumeclaim', component: PersistentVolumeClaimComponent},
      {path: 'persistentvolumeclaim/trash', component: TrashPersistentVolumeClaimComponent},
      {path: 'persistentvolumeclaim/tpl', component: PersistentVolumeClaimTplComponent},
      {path: 'persistentvolumeclaim/tpl/trash', component: TrashPersistentVolumeClaimTplComponent},
      {path: 'apikey', component: ApiKeyComponent},
      {path: 'statefulset', component: StatefulsetComponent},
      {path: 'statefulset/trash', component: TrashStatefulsetComponent},
      {path: 'statefulset/tpl', component: StatefulsettplComponent},
      {path: 'statefulset/tpl/trash', component: TrashStatefulsettplComponent},
      {path: 'daemonset', component: DaemonsetComponent},
      {path: 'daemonset/trash', component: TrashDaemonsetComponent},
      {path: 'daemonset/tpl', component: DaemonsettplComponent},
      {path: 'daemonset/tpl/trash', component: TrashDaemonsettplComponent},
      {path: 'config/database', component: ConfigComponent},
      {path: 'config/system', component: ConfigSystemComponent},
      {path: 'kubernetes/dashboard', component: KubernetesDashboardComponent},
      {path: 'kubernetes/dashboard/:cluster', component: KubernetesDashboardComponent},
      {path: 'kubernetes/node', component: NodesComponent},
      {path: 'kubernetes/node/:cluster', component: NodesComponent},
      {path: 'kubernetes/persistentvolume', component: PersistentVolumeComponent},
      {path: 'kubernetes/persistentvolume/:cluster', component: PersistentVolumeComponent},
      {path: 'kubernetes/persistentvolume/:cluster/edit/:name', component: CreateEditPersistentVolumeComponent},
      {path: 'kubernetes/persistentvolume/:cluster/edit', component: CreateEditPersistentVolumeComponent},
      {path: 'ingress', component: IngressComponent},
      {path: 'ingress/trash', component: TrashIngressComponent},
      {path: 'ingress/tpl', component: IngressTplComponent},
      {path: 'ingress/tpl/trash', component: TrashIngressTplComponent},
      {path: 'kubernetes/deployment', component: KubeDeploymentComponent},
      {path: 'kubernetes/deployment/:cluster', component: KubeDeploymentComponent},
      {path: 'kubernetes/namespace', component: KubeNamespaceComponent},
      {path: 'kubernetes/namespace/:cluster', component: KubeNamespaceComponent},
      ...ADMINROUTES
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
