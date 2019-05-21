import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeIngressComponent } from './kube-ingress.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from 'wayne-component/lib/deletion-dialog/deletion-dialog.module';
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
