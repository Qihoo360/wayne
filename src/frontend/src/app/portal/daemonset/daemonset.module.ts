import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PodClient } from '../../shared/client/v1/kubernetes/pod';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { PublicService } from '../../shared/client/v1/public.service';
import { PublishStatusService } from '../../shared/client/v1/publishstatus.service';
import { LogClient } from '../../shared/client/v1/kubernetes/log';
import { PublishDaemonSetTplComponent } from './publish-tpl/publish-tpl.component';
import { DaemonSetService } from '../../shared/client/v1/daemonset.service';
import { DaemonSetTplService } from '../../shared/client/v1/daemonsettpl.service';
import { DaemonSetClient } from '../../shared/client/v1/kubernetes/daemonset';
import { CreateEditDaemonSetComponent } from './create-edit-daemonset/create-edit-daemonset.component';
import { ListDaemonSetComponent } from './list-daemonset/list-daemonset.component';
import { CreateEditDaemonSetTplComponent } from './create-edit-daemonsettpl/create-edit-daemonsettpl.component';
import { DaemonSetComponent } from './daemonset.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    DaemonSetService,
    DaemonSetTplService,
    ClusterService,
    DaemonSetClient,
    PublicService,
    PodClient,
    PublishStatusService,
    LogClient
  ],
  exports: [
    DaemonSetComponent
  ],
  declarations: [
    DaemonSetComponent,
    CreateEditDaemonSetComponent,
    ListDaemonSetComponent,
    PublishDaemonSetTplComponent,
    CreateEditDaemonSetTplComponent

  ]
})

export class DaemonSetModule {
}
