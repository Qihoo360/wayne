import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ListGroupComponent } from './list-group/list-group.component';
import { CreateEditGroupComponent } from './create-edit-group/create-edit-group.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { Group } from '../../shared/model/v1/group';
import { GroupService } from '../../shared/client/v1/group.service';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {
  @ViewChild(ListGroupComponent, { static: false })
  listGroup: ListGroupComponent;
  @ViewChild(CreateEditGroupComponent, { static: false })
  createEditGroup: CreateEditGroupComponent;

  pageState: PageState = new PageState();
  changedGroups: Group[];

  subscription: Subscription;

  constructor(
    private groupService: GroupService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {

    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.GROUP) {
        const groupId = message.data;
        this.groupService.deleteGroup(groupId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('角色删除成功！');
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
    this.groupService.listGroup(this.pageState)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedGroups = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createGroup(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  deleteGroup(group: Group) {
    const deletionMessage = new ConfirmationMessage(
      '删除角色确认',
      '确认删除角色 ' + group.name + ' ？',
      group.id,
      ConfirmationTargets.GROUP,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  openModal(): void {
    this.createEditGroup.newOrEditGroup();
  }

  initGroup(): void {
    this.groupService.initGroup().subscribe(
      response => {
        this.messageHandlerService.showSuccess('角色初始化成功！');
        this.retrieve();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  editGroup(group: Group): void {
    this.createEditGroup.newOrEditGroup(group.id);
  }
}
