import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { State } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListDaemonsetComponent } from './list-daemonset/list-daemonset.component';
import { CreateEditDaemonsetComponent } from './create-edit-daemonset/create-edit-daemonset.component';
import { DaemonSet } from '../../shared/model/v1/daemonset';
import { DaemonSetService } from '../../shared/client/v1/daemonset.service';
import { PageState } from '../../shared/page/page-state';


@Component({
  selector: 'wayne-daemonset',
  templateUrl: './daemonset.component.html',
  styleUrls: ['./daemonset.component.scss']
})
export class DaemonsetComponent implements OnInit {

  @ViewChild(ListDaemonsetComponent)
  listDaemonset: ListDaemonsetComponent;
  @ViewChild(CreateEditDaemonsetComponent)
  createEditDaemonset: CreateEditDaemonsetComponent;

  appId: number;
  changedDaemonsets: DaemonSet[];
  pageState: PageState = new PageState();
  subscription: Subscription;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private daemonsetService: DaemonSetService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService
  ) {
    breadcrumbService.addFriendlyNameForRoute('/admin/daemonset', '守护进程集列表');
    breadcrumbService.addFriendlyNameForRoute('/admin/daemonset/trash', '已删除守护进程集列表');
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DAEMONSET) {
        let id = message.data;
        this.daemonsetService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('守护进程集删除成功！');
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
      this.appId = params['aid'];
      if (!this.appId) {
        this.appId = 0;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  retrieve(state?: State): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.params['deleted'] = false;
    if (!this.pageState.sort) {
      this.pageState.sort.by = 'id';
      this.pageState.sort.reverse = true;
    }
    this.pageState.params['relate'] = 'app';
    this.daemonsetService.listPage(this.pageState, this.appId)
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedDaemonsets = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createDaemonset(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEditDaemonset.newOrEdit();
  }

  deleteDaemonset(daemonset: DaemonSet) {
    let deletionMessage = new ConfirmationMessage(
      '删除守护进程集确认',
      '你确认删除守护进程集 ' + daemonset.name + ' ？',
      daemonset.id,
      ConfirmationTargets.DAEMONSET,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editDaemonset(daemonset: DaemonSet) {
    this.createEditDaemonset.newOrEdit(daemonset.id);
  }

}
