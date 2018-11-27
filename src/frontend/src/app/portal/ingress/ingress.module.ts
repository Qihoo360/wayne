import {NgModule} from '@angular/core';
import {IngressComponent} from './ingress.component';
import {SharedModule} from '../../shared/shared.module';
import {ListIngressComponent} from './list-ingress/list-ingress.component';
import {CreateEditIngressComponent} from './create-edit-ingress/create-edit-ingress.component';
import {ReactiveFormsModule} from '@angular/forms';
// import {CreateEditIngressTplComponent} from './create-edit-ingresstpl/create-edit-ingresstpl.component';
// import {PublishIngressTplComponent} from './publish-tpl/publish-tpl.component';
// import {ListEventComponent} from './list-event/list-event.component';
// import {ListPodComponent} from './list-pod/list-pod.component';
// import {IngressClient} from '../../shared/client/v1/kubernetes/ingress';
// import {PodClient} from '../../shared/client/v1/kubernetes/pod';
import {IngressService} from '../../shared/client/v1/ingress.service';
import {IngressTplService} from '../../shared/client/v1/ingresstpl.service';
import {ClusterService} from '../../shared/client/v1/cluster.service';
// import {PublicService} from '../../shared/client/v1/public.service';
// import {PublishStatusService} from '../../shared/client/v1/publishstatus.service';
// import {LogClient} from '../../shared/client/v1/kubernetes/log';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    IngressService,
    IngressTplService,
    ClusterService,
    // IngressClient,
    // PublicService,
    // PodClient,
    // PublishStatusService,
    // LogClient
  ],
  exports: [
    IngressComponent,

  ],
  declarations: [
    IngressComponent,
    CreateEditIngressComponent,
    ListIngressComponent,
    // CreateEditIngressTplComponent,
    // PublishIngressTplComponent,
    // ListEventComponent,
    // ListPodComponent
  ]
})

export class IngressModule {
}
