import { NgModule } from '@angular/core';
import { PortalRoutingModule } from './portal-routing.module';
import { PortalComponent } from './portal.component';
import { SharedModule } from '../shared/shared.module';
import { NavComponent } from './nav/nav.component';
import { IndexModule } from './index/index.module';
import { AppModule } from './app/app.module';
import { DeploymentModule } from './deployment/deployment.module';
import { AuthCheckGuard } from '../shared/auth/auth-check-guard.service';
import { AuthService } from '../shared/auth/auth.service';
import { ConfigMapModule } from './configmap/configmap.module';
import { CronjobModule } from './cronjob/cronjob.module';
import { SecretModule } from './secret/secret.module';
import { CacheService } from '../shared/auth/cache.service';
import { PublishHistoryService } from './common/publish-history/publish-history.service';
import { AppUserModule } from './app-user/app-user.module';
import { NamespaceUserModule } from './namespace-user/namespace-user.module';
import { TplDetailService } from '../shared/tpl-detail/tpl-detail.service';
import { PersistentVolumeClaimModule } from './persistentvolumeclaim/persistentvolumeclaim.module';
import { NamespaceApiKeyModule } from './namespace-apikey/apikey.module';
import { AppApiKeyModule } from './app-apikey/apikey.module';
import { AppWebHookModule } from './app-webhook/app-webhook.module';
import { NamespaceWebHookModule } from './namespace-webhook/namespace-webhook.module';
import { StatefulsetModule } from './statefulset/statefulset.module';
import { DaemonSetModule } from './daemonset/daemonset.module';
import { IngressModule } from './ingress/ingress.module';
import { PodLoggingComponent } from './pod-logging/pod-logging.component';
import { NamespaceReportModule } from './namespace-report/namespace-report.module';
import { BaseAppModule } from './base/base-app.module';
import { PublishHistoryModule } from './common/publish-history/publish-history.module';
import { TplDetailModule } from '../shared/tpl-detail/tpl-detail.module';
import { MarkdownModule } from 'ngx-markdown';
import { LibraryPortalModule } from '../../../lib/portal/library-portal.module';
import { AutoscaleModule } from './autoscale/autoscale.module';

@NgModule({
  imports: [
    AppUserModule,
    NamespaceUserModule,
    PortalRoutingModule,
    SharedModule,
    IndexModule,
    AppModule,
    DeploymentModule,
    ConfigMapModule,
    CronjobModule,
    SecretModule,
    PersistentVolumeClaimModule,
    AppWebHookModule,
    NamespaceWebHookModule,
    NamespaceApiKeyModule,
    AppApiKeyModule,
    StatefulsetModule,
    DaemonSetModule,
    NamespaceReportModule,
    BaseAppModule,
    TplDetailModule,
    PublishHistoryModule,
    LibraryPortalModule,
    IngressModule,
    AutoscaleModule,
    MarkdownModule.forRoot(),
  ],
  providers: [
    AuthCheckGuard,
    AuthService,
    CacheService,
    PublishHistoryService,
    TplDetailService
  ],
  declarations: [
    NavComponent,
    PortalComponent,
    PodLoggingComponent,
  ]
})
export class PortalModule {
}
