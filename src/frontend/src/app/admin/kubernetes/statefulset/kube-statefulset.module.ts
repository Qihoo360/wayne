import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeStatefulsetComponent } from './kube-statefulset.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from '../../../shared/deletion-dialog/deletion-dialog.module';
import { MigrationComponent } from './migration/migration.component';
import { ListStatefulsetComponent } from './list-statefulset/list-statefulset.component';

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
    KubeStatefulsetComponent,
    ListStatefulsetComponent
  ],
  declarations: [
    KubeStatefulsetComponent,
    ListStatefulsetComponent,
    MigrationComponent
  ]
})

export class KubeStatefulsetModule {
}
