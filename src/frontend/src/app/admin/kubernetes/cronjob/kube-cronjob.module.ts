import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeCronjobComponent } from './kube-cronjob.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from 'wayne-component/lib/deletion-dialog/deletion-dialog.module';
import { MigrationComponent } from './migration/migration.component';
import { ListCronjobComponent } from './list-cronjob/list-cronjob.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    DeletionDialogModule
  ],
  providers: [
    KubernetesClient
  ],
  exports: [
    KubeCronjobComponent,
    ListCronjobComponent
  ],
  declarations: [
    KubeCronjobComponent,
    ListCronjobComponent,
    MigrationComponent
  ]
})

export class KubeCronjobModule {
}
