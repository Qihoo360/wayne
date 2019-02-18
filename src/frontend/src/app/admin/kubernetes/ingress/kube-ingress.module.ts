import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeIngressComponent } from './kube-ingress.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from '../../../shared/deletion-dialog/deletion-dialog.module';
import { MigrationComponent } from './migration/migration.component';
import { ListIngressComponent } from './list-ingress/list-ingress.component';

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
    KubeIngressComponent,
    ListIngressComponent
  ],
  declarations: [
    KubeIngressComponent,
    ListIngressComponent,
    MigrationComponent
  ]
})

export class KubeIngressModule {
}
