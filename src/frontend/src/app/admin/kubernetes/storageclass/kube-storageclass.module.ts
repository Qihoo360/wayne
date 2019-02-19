import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeStorageclassComponent } from './kube-storageclass.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from '../../../shared/deletion-dialog/deletion-dialog.module';
import { ListStorageclassComponent } from './list-storageclass/list-storageclass.component';

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
    KubeStorageclassComponent,
    ListStorageclassComponent
  ],
  declarations: [
    KubeStorageclassComponent,
    ListStorageclassComponent
  ]
})

export class KubeStorageclassModule {
}
