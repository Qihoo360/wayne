import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CreateEditSecretComponent } from './create-edit-secret/create-edit-secret.component';
import { SecretComponent } from './secret.component';
import { ListSecretComponent } from './list-secret/list-secret.component';
import { CreateEditSecretTplComponent } from './create-edit-secrettpl/create-edit-secrettpl.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PublishSecretTplComponent } from './publish-tpl/publish-tpl.component';
import { SecretClient } from '../../shared/client/v1/kubernetes/secret';
import { SecretService } from '../../shared/client/v1/secret.service';
import { SecretTplService } from '../../shared/client/v1/secrettpl.service';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [
    SecretService,
    SecretTplService,
    SecretClient
  ],
  exports: [
    SecretComponent
  ],
  declarations: [
    SecretComponent,
    ListSecretComponent,
    CreateEditSecretComponent,
    CreateEditSecretTplComponent,
    PublishSecretTplComponent,
  ]
})

export class SecretModule {
}
