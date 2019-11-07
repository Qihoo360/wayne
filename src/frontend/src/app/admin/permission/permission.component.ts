import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ListPermissionComponent } from './list-permission/list-permission.component';
import { CreateEditPermissionComponent } from './create-edit-permission/create-edit-permission.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { Permission } from '../../shared/model/v1/permission';
import { PermissionService } from '../../shared/client/v1/permission.service';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})

export class PermissionComponent implements OnInit, OnDestroy {
  @ViewChild(ListPermissionComponent, { static: false })
  listPermission: ListPermissionComponent;
  @ViewChild(CreateEditPermissionComponent, { static: false })
  createEditPermission: CreateEditPermissionComponent;

  componentName = '操作权限';
  pageState: PageState = new PageState();
  changedPermissions: Permission[];

  subscription: Subscription;

  constructor(
    private permissionService: PermissionService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {

    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.PERMISSION) {
        const permissionId = message.data;
        this.permissionService.deletePermission(permissionId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(this.componentName + '删除成功！');
              this.retrieve();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.permissionService.listPermission(this.pageState)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedPermissions = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createPermission(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  deletePermission(permission: Permission) {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '确认',
      '确认删除 ' + this.componentName + permission.name + ' ？',
      permission.id,
      ConfirmationTargets.PERMISSION,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  openModal(): void {
    this.createEditPermission.newOrEditPermission();
  }

  initPermission(): void {
    this.permissionService.initDict()
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('权限初始化成功！');
          this.retrieve();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  editPermission(permission: Permission): void {
    this.createEditPermission.newOrEditPermission(permission.id);
  }
}
