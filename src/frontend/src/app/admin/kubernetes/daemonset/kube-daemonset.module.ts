import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeDaemonsetComponent } from './kube-daemonset.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from 'wayne-component/lib/deletion-dialog/deletion-dialog.module';
import { MigrationComponent } from './migration/migration.component';
import { ListDaemonsetComponent } from './list-daemonset/list-daemonset.component';

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
    KubeDaemonsetComponent,
    ListDaemonsetComponent
  ],
  declarations: [
    KubeDaemonsetComponent,
    ListDaemonsetComponent,
    MigrationComponent
  ]
})

export class KubeDaemonsetModule {
}
