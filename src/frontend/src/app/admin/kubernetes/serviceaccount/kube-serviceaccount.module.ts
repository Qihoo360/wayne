import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeServiceaccountComponent } from './kube-serviceaccount.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from '../../../shared/deletion-dialog/deletion-dialog.module';
import { ListServiceaccountComponent } from './list-serviceaccount/list-serviceaccount.component';

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
    KubeServiceaccountComponent,
    ListServiceaccountComponent
  ]
})

export class KubeServiceaccountModule {
}
