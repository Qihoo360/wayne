import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ApiKeyService } from '../../shared/client/v1/apikey.service';
import { CreateEditApiKeyComponent } from './create-edit-apikey/create-edit-apikey.component';
import { ListApiKeyComponent } from './list-apikey/list-apikey.component';
import { NamespaceApiKeyComponent } from './apikey.component';
import { TokenDetailComponent } from './token-detail/token-detail';
import { SidenavNamespaceModule } from '../sidenav-namespace/sidenav-namespace.module';

@NgModule({
  imports: [
    SharedModule,
    SidenavNamespaceModule
  ],
  providers: [
    ApiKeyService
  ],
  exports: [],
  declarations: [
    NamespaceApiKeyComponent,
    ListApiKeyComponent,
    TokenDetailComponent,
    CreateEditApiKeyComponent
  ]
})

export class NamespaceApiKeyModule {
}
