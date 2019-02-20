import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeClusterrolebindingComponent } from './kube-clusterrolebinding.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from '../../../shared/deletion-dialog/deletion-dialog.module';
import { ListClusterrolebindingComponent } from './list-clusterrolebinding/list-clusterrolebinding.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    DeletionDialogModule
  ],
  providers: [
    KubernetesClient
  ],
  exports: [],
  declarations: [
    KubeClusterrolebindingComponent,
    ListClusterrolebindingComponent
  ]
})

export class KubeClusterrolebindingModule {
}
