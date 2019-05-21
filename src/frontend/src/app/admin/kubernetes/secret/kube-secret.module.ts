import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeSecretComponent } from './kube-secret.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from 'wayne-component/lib/deletion-dialog/deletion-dialog.module';
import { MigrationComponent } from './migration/migration.component';
import { ListSecretComponent } from './list-secret/list-secret.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    DeletionDialogModule
  ],
  providers: [
    KubernetesClient
  ],
  declarations: [
    KubeSecretComponent,
    ListSecretComponent,
    MigrationComponent
  ]
})

export class KubeSecretModule {
}
