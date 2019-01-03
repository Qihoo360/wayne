import { NgModule } from '@angular/core';
import { SecretComponent } from './secret.component';
import { CreateEditSecretComponent } from './create-edit-secret/create-edit-secret.component';
import { ListSecretComponent } from './list-secret/list-secret.component';
import { TrashSecretComponent } from './trash-secret/trash-secret.component';
import { SharedModule } from '../../shared/shared.module';
import { SecretService } from '../../shared/client/v1/secret.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    SecretService
  ],
  exports: [
    SecretComponent,
    ListSecretComponent
  ],
  declarations: [
    SecretComponent,
    ListSecretComponent,
    CreateEditSecretComponent,
    TrashSecretComponent
  ]
})

export class SecretModule {
}
