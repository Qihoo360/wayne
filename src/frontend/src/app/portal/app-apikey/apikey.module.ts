import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ApiKeyService } from '../../shared/client/v1/apikey.service';
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
