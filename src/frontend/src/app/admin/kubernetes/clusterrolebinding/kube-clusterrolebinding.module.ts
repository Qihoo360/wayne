import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeClusterrolebindingComponent } from './kube-clusterrolebinding.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from 'wayne-component/lib/deletion-dialog/deletion-dialog.module';
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
