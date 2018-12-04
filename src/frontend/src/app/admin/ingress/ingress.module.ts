import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CreateEditIngressComponent } from './create-edit-ingress/create-edit-ingress.component';
import { IngressComponent } from './ingress.component';
import { ListIngressComponent } from './list-ingress/list-ingress.component';
import { TrashIngressComponent } from './trash-ingress/trash-ingress.component';
import { IngressService } from '../../shared/client/v1/ingress.service';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [
    IngressService
  ],
  exports: [
    IngressComponent,
    ListIngressComponent
  ],
  declarations: [
    IngressComponent,
    ListIngressComponent,
    CreateEditIngressComponent,
    TrashIngressComponent,
  ]
})

export class IngressModule {
}
