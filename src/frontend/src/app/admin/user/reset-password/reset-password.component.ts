import { Component, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { User } from '../../../shared/model/v1/user';
import { UserService } from '../../../shared/client/v1/user.service';

@Component({
  selector: 'reset-password',
  templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent {
  opened: boolean;
  userForm: NgForm;
  @ViewChild('passForm', { static: true })
  currentForm: NgForm;

  user: User = new User();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  userTitle: string;

  alertMsg: string;

  constructor(
    private userService: UserService,
    private messageHandlerService: MessageHandlerService) {
  }

  resetPassword(user: User) {
    this.opened = true;
    this.user = user;
  }

  onCancel() {
    this.opened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    if (this.user.password !== this.user.rePassword) {
      this.alertMsg = '两次输入密码不一致，请检查！';
      this.isSubmitOnGoing = false;
      return;
    }
    if (this.user.password === '') {
      this.alertMsg = '密码不能为空！';
      this.isSubmitOnGoing = false;
      return;
    }
    this.userService.resetPassword(this.user).subscribe(
      resp => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.showSuccess('密码重置成功！');
      },
      error => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.handleError(error);
      }
    );
    this.opened = false;
    this.currentForm.reset();
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      !this.checkOnGoing;
  }
}

