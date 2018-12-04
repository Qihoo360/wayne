import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ApiKeyService } from '../../shared/client/v1/apikey.service';
import { CreateEditApiKeyComponent } from './create-edit-apikey/create-edit-apikey.component';
import { ListApiKeyComponent } from './list-apikey/list-apikey.component';
import { ApiKeyComponent } from './apikey.component';
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
    ApiKeyComponent,
    ListApiKeyComponent,
    TokenDetailComponent,
    CreateEditApiKeyComponent
  ]
})

export class ApiKeyModule {
}
