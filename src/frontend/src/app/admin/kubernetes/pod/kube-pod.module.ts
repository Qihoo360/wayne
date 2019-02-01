import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubePodComponent } from './kube-pod.component';
import { ListPodComponent } from './list-pod/list-pod.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
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
