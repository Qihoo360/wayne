import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeReplicasetComponent } from './kube-replicaset.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from 'wayne-component/lib/deletion-dialog/deletion-dialog.module';
import { ListReplicasetComponent } from './list-replicaset/list-replicaset.component';

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
    KubeReplicasetComponent,
    ListReplicasetComponent
  ],
  declarations: [
    KubeReplicasetComponent,
    ListReplicasetComponent
  ]
})

export class KubeReplicasetModule {
}
