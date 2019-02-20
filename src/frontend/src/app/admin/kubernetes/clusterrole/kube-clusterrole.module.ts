import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeClusterroleComponent } from './kube-clusterrole.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from '../../../shared/deletion-dialog/deletion-dialog.module';
import { ListClusterroleComponent } from './list-clusterrole/list-clusterrole.component';

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
    KubeClusterroleComponent,
    ListClusterroleComponent
  ]
})

export class KubeClusterroleModule {
}
