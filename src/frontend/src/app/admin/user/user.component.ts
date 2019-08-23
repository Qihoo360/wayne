import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { User } from '../../shared/model/v1/user';
import { UserService } from '../../shared/client/v1/user.service';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild(ListUserComponent, { static: false })
  listUser: ListUserComponent;
  @ViewChild(CreateEditUserComponent, { static: false })
  createEditUser: CreateEditUserComponent;

  pageState: PageState = new PageState();
  groupId: number;
  changedUsers: User[];

  subscription: Subscription;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.USER) {
        const userId = message.data;
        this.userService.deleteUser(userId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('用户删除成功！');
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
    this.route.params.subscribe(params => {
    });
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
    this.userService.listUser(this.pageState)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedUsers = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createUser(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  deleteUser(user: User) {
    const deletionMessage = new ConfirmationMessage(
      '删除用户确认',
      '确认删除用户 ' + user.name + ' ？',
      user.id,
      ConfirmationTargets.USER,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  openModal(): void {
    this.createEditUser.newOrEditUser();
  }

  editUser(user: User): void {
    this.createEditUser.newOrEditUser(user.id);
  }
}
