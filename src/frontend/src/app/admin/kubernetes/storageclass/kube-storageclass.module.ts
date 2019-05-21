import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeStorageclassComponent } from './kube-storageclass.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from 'wayne-component/lib/deletion-dialog/deletion-dialog.module';
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
