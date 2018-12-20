import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { PersistentVolumeClient } from '../../../shared/client/v1/kubernetes/persistentvolume';
import { ReactiveFormsModule } from '@angular/forms';
import { PersistentVolumeRobinClient } from '../../../shared/client/v1/kubernetes/persistentvolume-robin';
import { KubeNamespaceComponent } from './kube-namespace.component';
import { ListNamespaceComponent } from './list-namespace/list-namespace.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [
    PersistentVolumeClient,
    PersistentVolumeRobinClient
  ],
  exports: [
    KubeNamespaceComponent,
    ListNamespaceComponent
  ],
  declarations: [
    KubeNamespaceComponent,
    ListNamespaceComponent
  ]
})

export class KubeNamespaceModule {
}
