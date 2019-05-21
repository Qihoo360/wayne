import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CreateEditCronjobComponent } from './create-edit-cronjob/create-edit-cronjob.component';
import { CronjobComponent } from './cronjob.component';
import { ListCronjobComponent } from './list-cronjob/list-cronjob.component';
import { ListJobComponent } from './list-job/list-job.component';
import { CreateEditCronjobTplComponent } from './create-edit-cronjobtpl/create-edit-cronjobtpl.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PublishCronjobTplComponent } from './publish-tpl/publish-tpl.component';
import { CronjobClient } from 'wayne-component/lib/client/v1/kubernetes/cronjob';
import { JobClient } from 'wayne-component/lib/client/v1/kubernetes/job';
import { CronjobService } from 'wayne-component/lib/client/v1/cronjob.service';
import { CronjobTplService } from 'wayne-component/lib/client/v1/cronjobtpl.service';
import { PodClient } from 'wayne-component/lib/client/v1/kubernetes/pod';
import { PublicService } from 'wayne-component/lib/client/v1/public.service';
import { LogClient } from 'wayne-component/lib/client/v1/kubernetes/log';
import { ListPodComponent } from './list-pod/list-pod.component';
import { EventClient } from 'wayne-component/lib/client/v1/kubernetes/event';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [
    CronjobService,
    CronjobTplService,
    CronjobClient,
    JobClient,
    PublicService,
    PodClient,
    LogClient,
    EventClient
  ],
  exports: [
    CronjobComponent
  ],
  declarations: [
    CronjobComponent,
    ListCronjobComponent,
    ListJobComponent,
    ListPodComponent,
    CreateEditCronjobComponent,
    CreateEditCronjobTplComponent,
    PublishCronjobTplComponent,
  ]
})

export class CronjobModule {
}
