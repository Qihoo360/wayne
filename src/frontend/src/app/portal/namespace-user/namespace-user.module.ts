import { NgModule } from '@angular/core';
import { NamespaceUserComponent } from './namespace-user.component';
import { CreateEditNamespaceUserComponent } from './create-edit-namespace-user/create-edit-namespace-user.component';
import { ListNamespaceUserComponent } from './list-namespace-user/list-namespace-user.component';
import { SharedModule } from '../../shared/shared.module';
import { NamespaceUserService } from '../../shared/client/v1/namespace-user.service';
import { SidenavNamespaceModule } from '../sidenav-namespace/sidenav-namespace.module';

@NgModule({
  imports: [
    SharedModule,
    SidenavNamespaceModule
  ],
  providers: [
    NamespaceUserService
  ],
  exports: [
    NamespaceUserComponent,
    CreateEditNamespaceUserComponent,
    ListNamespaceUserComponent
  ],
  declarations: [
    NamespaceUserComponent,
    ListNamespaceUserComponent,
    CreateEditNamespaceUserComponent,
  ]
})

export class NamespaceUserModule {
}
