import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeEndpointComponent } from './kube-endpoint.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from '../../../shared/deletion-dialog/deletion-dialog.module';
import { ListEndpointComponent } from './list-endpoint/list-endpoint.component';

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
    KubeEndpointComponent,
    ListEndpointComponent
  ],
  declarations: [
    KubeEndpointComponent,
    ListEndpointComponent
  ]
})

export class KubeEndpointModule {
}
