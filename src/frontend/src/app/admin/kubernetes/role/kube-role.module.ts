import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KubeRoleComponent } from './kube-role.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { DeletionDialogModule } from 'wayne-component/lib/deletion-dialog/deletion-dialog.module';
import { ListRoleComponent } from './list-role/list-role.component';

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
    KubeRoleComponent,
    ListRoleComponent
  ],
  declarations: [
    KubeRoleComponent,
    ListRoleComponent
  ]
})

export class KubeRoleModule {
}
