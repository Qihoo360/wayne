import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeCrdComponent } from './kube-crd.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from '../../../shared/deletion-dialog/deletion-dialog.module';
import { ListCrdComponent } from './list-crd/list-crd.component';
import { CRDDgRowDetailComponent } from './crd-dg-row-detail/crd-dg-row-detail.component';
import { CustomCRDClient } from '../../../shared/client/v1/kubernetes/crd';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    DeletionDialogModule
  ],
  providers: [
    KubernetesClient,
    CustomCRDClient
  ],
  exports: [],
  declarations: [
    KubeCrdComponent,
    ListCrdComponent,
    CRDDgRowDetailComponent
  ]
})

export class KubeCrdModule {
}
