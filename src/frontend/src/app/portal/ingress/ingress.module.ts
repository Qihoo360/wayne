import { NgModule } from '@angular/core';
import { IngressComponent } from './ingress.component';
import { SharedModule } from '../../shared/shared.module';
import { ListIngressComponent } from './list-ingress/list-ingress.component';
import { CreateEditIngressComponent } from './create-edit-ingress/create-edit-ingress.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateEditIngressTplComponent } from './create-edit-ingresstpl/create-edit-ingresstpl.component';
import { IngressClient } from 'wayne-component/lib/client/v1/kubernetes/ingress';
import { PublishIngressTplComponent } from './publish-tpl/publish-tpl.component';
import { IngressService } from 'wayne-component/lib/client/v1/ingress.service';
import { IngressTplService } from 'wayne-component/lib/client/v1/ingresstpl.service';
import { ClusterService } from 'wayne-component/lib/client/v1/cluster.service';
import { IngressStatusComponent } from './status/status.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    IngressService,
    IngressTplService,
    ClusterService,
    IngressClient,
  ],
  exports: [
    IngressComponent,

  ],
  declarations: [
    IngressComponent,
    CreateEditIngressComponent,
    ListIngressComponent,
    CreateEditIngressTplComponent,
    PublishIngressTplComponent,
    IngressStatusComponent
  ]
})

export class IngressModule {
}
