import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { Permission } from '../../../shared/model/v1/permission';
import { PermissionService } from '../../../shared/client/v1/permission.service';

@Component({
  selector: 'create-edit-permission',
  templateUrl: 'create-edit-permission.component.html',
  styleUrls: ['create-edit-permission.scss']
})
export class CreateEditPermissionComponent {
  @Output() create = new EventEmitter<boolean>();
  createPermissionOpened: boolean;

  permissionForm: NgForm;
  @ViewChild('permissionForm', { static: true })
  currentForm: NgForm;

  componentName = '操作权限';
  permission: Permission = new Permission();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  permissionTitle: string;
  actionType: ActionType;

  constructor(
    private permissionService: PermissionService,
    private messageHandlerService: MessageHandlerService
  ) {
  }

  newOrEditPermission(id?: number) {
    this.createPermissionOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.permissionTitle = '编辑权限';
      this.permissionService.getPermission(id).subscribe(
        status => {
          this.permission = status.data;
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.permissionTitle = '创建权限';
      this.permission = new Permission();
    }
  }

  onCancel() {
    this.createPermissionOpened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;

    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.permissionService.createPermission(this.permission).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createPermissionOpened = false;
            this.messageHandlerService.showSuccess('创建' + this.componentName + '成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createPermissionOpened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
      case ActionType.EDIT:
        this.permissionService.updatePermission(this.permission).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createPermissionOpened = false;
            this.messageHandlerService.showSuccess('更新' + this.componentName + '成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createPermissionOpened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
    }
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing;
  }

  handleValidation(): void {
    const cont = this.currentForm.controls['permission_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }
}

