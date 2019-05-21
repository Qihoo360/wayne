import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from 'wayne-component';
import { PageState } from 'wayne-component/lib/page/page-state';
import { ListDaemonsettplComponent } from './list-daemonsettpl/list-daemonsettpl.component';
import { CreateEditDaemonsettplComponent } from './create-edit-daemonsettpl/create-edit-daemonsettpl.component';
import { DaemonSetTplService } from 'wayne-component/lib/client/v1/daemonsettpl.service';
import { DaemonSetTemplate } from 'wayne-component/lib/model/v1/daemonsettpl';
import { isNotEmpty } from 'wayne-component/lib/utils';

@Component({
  selector: 'wayne-daemonsettpl',
  templateUrl: './daemonsettpl.component.html',
  styleUrls: ['./daemonsettpl.component.scss']
})
export class DaemonsettplComponent implements OnInit, OnDestroy {

  @ViewChild(ListDaemonsettplComponent)
  listDaemonset: ListDaemonsettplComponent;
  @ViewChild(CreateEditDaemonsettplComponent)
  createEditDaemonset: CreateEditDaemonsettplComponent;
  pageState: PageState = new PageState({pageSize: 10});
  daemonsetId: number;
  changedDaemonsets: DaemonSetTemplate[];

  subscription: Subscription;

  constructor(
    private daemonsetTplService: DaemonSetTplService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DAEMONSET_TPL) {
        const id = message.data;
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
      if (typeof (this.daemonsetId) === 'undefined') {
        this.daemonsetId = 0;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {
        pageSize: 10,
        totalPage: this.pageState.page.totalPage,
        totalCount: this.pageState.page.totalCount
      });
    }
    this.pageState.params['deleted'] = false;
    if (this.route.snapshot.queryParams) {
      Object.getOwnPropertyNames(this.route.snapshot.queryParams).map(key => {
        const value = this.route.snapshot.queryParams[key];
        if (isNotEmpty(value)) {
          this.pageState.filters[key] = value;
        }
      });
    }
    this.daemonsetTplService.listPage(this.pageState, this.daemonsetId)
      .subscribe(
        response => {
          const data = response.data;
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
    const deletionMessage = new ConfirmationMessage(
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
