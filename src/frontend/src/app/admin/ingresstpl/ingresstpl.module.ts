import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CreateEditIngressTplComponent } from './create-edit-ingresstpl/create-edit-ingresstpl.component';
import { IngressTplComponent } from './ingresstpl.component';
import { ListIngressTplComponent } from './list-ingresstpl/list-ingresstpl.component';
import { TrashIngressTplComponent } from './trash-ingresstpl/trash-ingresstpl.component';
import { IngressService } from 'wayne-component/lib/client/v1/ingress.service';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [
    IngressService
  ],
  exports: [
    IngressTplComponent,
    ListIngressTplComponent
  ],
  declarations: [
    IngressTplComponent,
    ListIngressTplComponent,
    CreateEditIngressTplComponent,
    TrashIngressTplComponent,
  ]
})

export class IngressTplModule {
}
