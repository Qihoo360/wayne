import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PodClient } from '../../shared/client/v1/kubernetes/pod';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { PublicService } from '../../shared/client/v1/public.service';
import { PublishStatusService } from '../../shared/client/v1/publishstatus.service';
import { LogClient } from '../../shared/client/v1/kubernetes/log';
import { StatefulsetService } from '../../shared/client/v1/statefulset.service';
import { StatefulsetTplService } from 'app/shared/client/v1/statefulsettpl.service';
import { StatefulsetClient } from '../../shared/client/v1/kubernetes/statefulset';
import { CreateEditStatefulsetComponent } from './create-edit-statefulset/create-edit-statefulset.component';
import { ListStatefulsetComponent } from './list-statefulset/list-statefulset.component';
import { StatefulsetComponent } from './statefulset.component';
import { PublishStatefulsetTplComponent } from './publish-tpl/publish-tpl.component';
import { CreateEditStatefulsettplComponent } from './create-edit-statefulsettpl/create-edit-statefulsettpl.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    StatefulsetService,
    StatefulsetTplService,
    ClusterService,
    StatefulsetClient,
    PublicService,
    PodClient,
    PublishStatusService,
    LogClient
  ],
  exports: [
    StatefulsetComponent
  ],
  declarations: [
    StatefulsetComponent,
    CreateEditStatefulsetComponent,
    ListStatefulsetComponent,
    PublishStatefulsetTplComponent,
    CreateEditStatefulsettplComponent

  ]
})

export class StatefulsetModule {
}
