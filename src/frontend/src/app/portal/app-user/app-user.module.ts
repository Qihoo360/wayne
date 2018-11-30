import { NgModule } from '@angular/core';
import { AppUserComponent } from './app-user.component';
import { CreateEditAppUserComponent } from './create-edit-app-user/create-edit-app-user.component';
import { ListAppUserComponent } from './list-app-user/list-app-user.component';
import { SharedModule } from '../../shared/shared.module';
import { AppUserService } from '../../shared/client/v1/app-user.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    AppUserService
  ],
  exports: [
    AppUserComponent,
    CreateEditAppUserComponent,
    ListAppUserComponent
  ],
  declarations: [
    AppUserComponent,
    ListAppUserComponent,
    CreateEditAppUserComponent,
  ]
})

export class AppUserModule {
}
