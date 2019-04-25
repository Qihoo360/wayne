import { NgModule } from '@angular/core';
import { SharedModule } from 'wayne-component/lib/shared.module';
import { ApiKeyService } from 'wayne-component/lib/client/v1/apikey.service';
import { CreateEditApiKeyComponent } from './create-edit-apikey/create-edit-apikey.component';
import { ListApiKeyComponent } from './list-apikey/list-apikey.component';
import { AppApiKeyComponent } from './apikey.component';
import { TokenDetailComponent } from './token-detail/token-detail';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    ApiKeyService
  ],
  exports: [],
  declarations: [
    AppApiKeyComponent,
    ListApiKeyComponent,
    TokenDetailComponent,
    CreateEditApiKeyComponent
  ]
})

export class AppApiKeyModule {
}
