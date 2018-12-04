import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { State } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { PageState } from '../../shared/page/page-state';
import { ListDaemonsettplComponent } from './list-daemonsettpl/list-daemonsettpl.component';
import { CreateEditDaemonsettplComponent } from './create-edit-daemonsettpl/create-edit-daemonsettpl.component';
import { DaemonSetTplService } from '../../shared/client/v1/daemonsettpl.service';
import { DaemonSetTemplate } from '../../shared/model/v1/daemonsettpl';

@Component({
  selector: 'wayne-daemonsettpl',
  templateUrl: './daemonsettpl.component.html',
  styleUrls: ['./daemonsettpl.component.scss']
})
export class DaemonsettplComponent implements OnInit {

  @ViewChild(ListDaemonsettplComponent)
  listDaemonset: ListDaemonsettplComponent;
  @ViewChild(CreateEditDaemonsettplComponent)
  createEditDaemonset: CreateEditDaemonsettplComponent;
  pageState: PageState = new PageState({pageSize: 10});
  daemonsetId: number;
  changedDaemonsets: DaemonSetTemplate[];

  subscription: Subscription;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private daemonsetTplService: DaemonSetTplService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/daemonset/tpl', '守护进程集模板列表');
    breadcrumbService.addFriendlyNameForRoute('/admin/daemonset/tpl/trash', '已删除守护进程集模板列表');
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DAEMONSET_TPL) {
        let id = message.data;
        this.daemonsetTplService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('守护进程集模版删除成功！');
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
      this.daemonsetId = params['did'];
      if (typeof (this.daemonsetId) == 'undefined') {
        this.daemonsetId = 0;
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
      this.pageState = PageState.fromState(state, {
        pageSize: 10,
        totalPage: this.pageState.page.totalPage,
        totalCount: this.pageState.page.totalCount
      });
    }
    this.pageState.params['deleted'] = false;
    this.daemonsetTplService.listPage(this.pageState, this.daemonsetId)
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

  deleteDaemonset(tpl: DaemonSetTemplate) {
    let deletionMessage = new ConfirmationMessage(
      '删除守护进程集模版确认',
      '你确认删除守护进程集模版 ' + tpl.name + ' ？',
      tpl.id,
      ConfirmationTargets.DAEMONSET_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editDaemonset(tpl: DaemonSetTemplate) {
    this.createEditDaemonset.newOrEdit(tpl.id);
  }

}
