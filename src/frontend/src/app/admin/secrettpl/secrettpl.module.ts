import { NgModule } from '@angular/core';
import { SecretTplComponent } from './secrettpl.component';
import { CreateEditSecretTplComponent } from './create-edit-secrettpl/create-edit-secrettpl.component';
import { ListSecretTplComponent } from './list-secrettpl/list-secrettpl.component';
import { TrashSecretTplComponent } from './trash-secrettpl/trash-secrettpl.component';
import { SharedModule } from '../../shared/shared.module';
import { SecretTplService } from '../../shared/client/v1/secrettpl.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    SecretTplService
  ],
  exports: [
    SecretTplComponent,
    ListSecretTplComponent
  ],
  declarations: [
    SecretTplComponent,
    ListSecretTplComponent,
    CreateEditSecretTplComponent,
    TrashSecretTplComponent
  ]
})

export class SecrettplModule {
}
