import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeHpaComponent } from './kube-hpa.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from 'wayne-component/lib/deletion-dialog/deletion-dialog.module';
import { MigrationComponent } from './migration/migration.component';
import { ListHpaComponent } from './list-hpa/list-hpa.component';

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
    KubeHpaComponent,
    ListHpaComponent
  ],
  declarations: [
    KubeHpaComponent,
    ListHpaComponent,
    MigrationComponent
  ]
})

export class KubeHpaModule {
}
