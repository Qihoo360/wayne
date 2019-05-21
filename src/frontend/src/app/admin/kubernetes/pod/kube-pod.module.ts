import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubePodComponent } from './kube-pod.component';
import { ListPodComponent } from './list-pod/list-pod.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from 'wayne-component/lib/deletion-dialog/deletion-dialog.module';

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
    KubePodComponent,
    ListPodComponent
  ],
  declarations: [
    KubePodComponent,
    ListPodComponent
  ]
})

export class KubePodModule {
}
