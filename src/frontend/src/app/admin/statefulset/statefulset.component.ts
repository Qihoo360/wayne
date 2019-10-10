import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListStatefulsetComponent } from './list-statefulset/list-statefulset.component';
import { CreateEditStatefulsetComponent } from './create-edit-statefulset/create-edit-statefulset.component';
import { Statefulset } from '../../shared/model/v1/statefulset';
import { StatefulsetService } from '../../shared/client/v1/statefulset.service';
import { PageState } from '../../shared/page/page-state';


@Component({
  selector: 'wayne-statefulset',
  templateUrl: './statefulset.component.html',
  styleUrls: ['./statefulset.component.scss']
})
export class StatefulsetComponent implements OnInit, OnDestroy {

  @ViewChild(ListStatefulsetComponent, { static: false })
  listStatefulset: ListStatefulsetComponent;
  @ViewChild(CreateEditStatefulsetComponent, { static: false })
  createEditStatefulset: CreateEditStatefulsetComponent;

  appId: number;
  changedStatefulsets: Statefulset[];
  pageState: PageState = new PageState();
  subscription: Subscription;

  constructor(
    private statefulsetService: StatefulsetService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService
  ) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.STATEFULSET) {
        const id = message.data;
        this.statefulsetService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('状态副本集删除成功！');
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

  retrieve(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.params['deleted'] = false;
    if (!this.pageState.sort) {
      this.pageState.sort.by = 'id';
      this.pageState.sort.reverse = true;
    }
    this.pageState.params['relate'] = 'app';
    this.statefulsetService.listPage(this.pageState, this.appId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedStatefulsets = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createStatefulset(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEditStatefulset.newOrEdit();
  }

  deleteStatefulset(statefulset: Statefulset) {
    const deletionMessage = new ConfirmationMessage(
      '删除状态副本集确认',
      '你确认删除状态副本集 ' + statefulset.name + ' ？',
      statefulset.id,
      ConfirmationTargets.STATEFULSET,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editStatefulset(statefulset: Statefulset) {
    this.createEditStatefulset.newOrEdit(statefulset.id);
  }

}
