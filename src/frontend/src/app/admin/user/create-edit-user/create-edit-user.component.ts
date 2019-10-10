import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { User } from '../../../shared/model/v1/user';
import { UserService } from '../../../shared/client/v1/user.service';

@Component({
  selector: 'create-edit-user',
  templateUrl: 'create-edit-user.component.html',
  styleUrls: ['create-edit-user.scss']
})
export class CreateEditUserComponent {
  @Output() create = new EventEmitter<boolean>();
  createUserOpened: boolean;

  userForm: NgForm;
  @ViewChild('userForm', { static: true })
  currentForm: NgForm;

  user: User = new User();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;
  isDisplayValid = true;
  isEmailValid = true;

  userTitle: string;
  actionType: ActionType;

  constructor(
    private userService: UserService,
    private messageHandlerService: MessageHandlerService
  ) {
  }

  log() {
  }

  newOrEditUser(id?: number) {
    this.createUserOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.userTitle = '编辑用户';
      this.userService.getUser(id).subscribe(
        status => {
          this.user = status.data;
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.userTitle = '创建用户';
      this.user = new User();
    }
  }

  onCancel() {
    this.createUserOpened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.userService.createUser(this.user).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createUserOpened = false;
            this.messageHandlerService.showSuccess('创建用户成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createUserOpened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
      case ActionType.EDIT:
        this.userService.updateUser(this.user).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createUserOpened = false;
            this.messageHandlerService.showSuccess('更新用户成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createUserOpened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
    }
    this.currentForm.reset();
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing && this.isEmailValid && this.isDisplayValid;
  }

  // Handle the form validation
  handleNameValidation(): void {
    const cont = this.currentForm.controls['user_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }

  handleEmailValidation(): void {
    const cont = this.currentForm.controls['user_email'];
    if (cont) {
      this.isEmailValid = cont.valid;
    }
  }
}

