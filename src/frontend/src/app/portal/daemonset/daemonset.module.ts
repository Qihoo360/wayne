import { NgModule } from '@angular/core';
import { SharedModule } from 'wayne-component/lib/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PodClient } from 'wayne-component/lib/client/v1/kubernetes/pod';
import { ClusterService } from 'wayne-component/lib/client/v1/cluster.service';
import { PublicService } from 'wayne-component/lib/client/v1/public.service';
import { PublishStatusService } from 'wayne-component/lib/client/v1/publishstatus.service';
import { LogClient } from 'wayne-component/lib/client/v1/kubernetes/log';
import { PublishDaemonSetTplComponent } from './publish-tpl/publish-tpl.component';
import { DaemonSetService } from 'wayne-component/lib/client/v1/daemonset.service';
import { DaemonSetTplService } from 'wayne-component/lib/client/v1/daemonsettpl.service';
import { DaemonSetClient } from 'wayne-component/lib/client/v1/kubernetes/daemonset';
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
