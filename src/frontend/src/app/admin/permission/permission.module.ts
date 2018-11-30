import { NgModule } from '@angular/core';
import { PermissionComponent } from './permission.component';
import { CreateEditPermissionComponent } from './create-edit-permission/create-edit-permission.component';
import { ListPermissionComponent } from './list-permission/list-permission.component';
import { SharedModule } from '../../shared/shared.module';
import { PermissionService } from '../../shared/client/v1/permission.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    PermissionService
  ],
  exports: [
    PermissionComponent,
    ListPermissionComponent
  ],
  declarations: [
    PermissionComponent,
    ListPermissionComponent,
    CreateEditPermissionComponent
  ]
})

export class PermissionModule {
}
