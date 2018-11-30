import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';
import { ListUserComponent } from './list-user/list-user.component';
import { SharedModule } from '../../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { UserService } from '../../shared/client/v1/user.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    UserService
  ],
  exports: [
    BrowserModule,
    UserComponent,
    ListUserComponent
  ],
  declarations: [
    UserComponent,
    ListUserComponent,
    CreateEditUserComponent,
    ResetPasswordComponent
  ]
})

export class UserModule {
}
