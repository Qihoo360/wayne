import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeConfigmapComponent } from './kube-configmap.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from '../../../shared/deletion-dialog/deletion-dialog.module';
import { MigrationComponent } from './migration/migration.component';
import { ListConfigmapComponent } from './list-configmap/list-configmap.component';

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
    KubeConfigmapComponent,
    ListConfigmapComponent
  ],
  declarations: [
    KubeConfigmapComponent,
    ListConfigmapComponent,
    MigrationComponent
  ]
})

export class KubeConfigmapModule {
}
