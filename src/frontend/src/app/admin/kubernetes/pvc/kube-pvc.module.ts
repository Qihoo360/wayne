import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubePvcComponent } from './kube-pvc.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from '../../../shared/deletion-dialog/deletion-dialog.module';
import { MigrationComponent } from './migration/migration.component';
import { ListPvcComponent } from './list-pvc/list-pvc.component';

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
    KubePvcComponent,
    ListPvcComponent
  ],
  declarations: [
    KubePvcComponent,
    ListPvcComponent,
    MigrationComponent
  ]
})

export class KubePvcModule {
}
