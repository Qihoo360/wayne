import { NgModule } from '@angular/core';
import { AppWebHookComponent } from './app-webhook.component';
import { CreateEditAppWebHookComponent } from './create-edit-app-webhook/create-edit-app-webhook.component';
import { ListAppWebHookComponent } from './list-app-webhook/list-app-webhook.component';
import { SharedModule } from 'wayne-component/lib/shared.module';
import { WebHookService } from 'wayne-component/lib/client/v1/webhook.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    WebHookService
  ],
  exports: [
    AppWebHookComponent,
    CreateEditAppWebHookComponent,
    ListAppWebHookComponent
  ],
  declarations: [
    AppWebHookComponent,
    ListAppWebHookComponent,
    CreateEditAppWebHookComponent,
  ]
})

export class AppWebHookModule {
}
