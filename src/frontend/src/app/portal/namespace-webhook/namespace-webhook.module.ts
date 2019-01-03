import { NgModule } from '@angular/core';
import { NamespaceWebHookComponent } from './namespace-webhook.component';
import { CreateEditNamespaceWebHookComponent } from './create-edit-namespace-webhook/create-edit-namespace-webhook.component';
import { ListNamespaceWebHookComponent } from './list-namespace-webhook/list-namespace-webhook.component';
import { SharedModule } from '../../shared/shared.module';
import { WebHookService } from '../../shared/client/v1/webhook.service';
import { SidenavNamespaceModule } from '../sidenav-namespace/sidenav-namespace.module';

@NgModule({
  imports: [
    SharedModule,
    SidenavNamespaceModule
  ],
  providers: [
    WebHookService
  ],
  exports: [
    NamespaceWebHookComponent,
    CreateEditNamespaceWebHookComponent,
    ListNamespaceWebHookComponent
  ],
  declarations: [
    NamespaceWebHookComponent,
    ListNamespaceWebHookComponent,
    CreateEditNamespaceWebHookComponent,
  ]
})

export class NamespaceWebHookModule {
}
