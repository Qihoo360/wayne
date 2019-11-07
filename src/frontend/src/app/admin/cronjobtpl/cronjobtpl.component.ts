import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { CreateEditCronjobTplComponent } from './create-edit-cronjobtpl/create-edit-cronjobtpl.component';
import { ListCronjobTplComponent } from './list-cronjobtpl/list-cronjobtpl.component';
import { CronjobTpl } from '../../shared/model/v1/cronjobtpl';
import { CronjobTplService } from '../../shared/client/v1/cronjobtpl.service';
import { PageState } from '../../shared/page/page-state';
import { isNotEmpty } from '../../shared/utils';

@Component({
  selector: 'wayne-cronjobtpl',
  templateUrl: './cronjobtpl.component.html',
  styleUrls: ['./cronjobtpl.component.scss']
})
export class CronjobTplComponent implements OnInit, OnDestroy {
  @ViewChild(ListCronjobTplComponent, { static: false })
  list: ListCronjobTplComponent;
  @ViewChild(CreateEditCronjobTplComponent, { static: false })
  createEdit: CreateEditCronjobTplComponent;

  componentName = '计划任务模板';
  pageState: PageState = new PageState({pageSize: 10});
  cronjobId: string;
  cronjobTpls: CronjobTpl[];

  subscription: Subscription;

  constructor(
    private cronjobTplService: CronjobTplService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CRONJOB_TPL) {
        const id = message.data;
        this.cronjobTplService.deleteById(id, 0)
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
    this.route.params.subscribe(params => {
      this.cronjobId = params['cid'];
      if (typeof (this.cronjobId) === 'undefined') {
        this.cronjobId = '';
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
    this.cronjobTplService.listPage(this.pageState, 0, this.cronjobId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.cronjobTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createCronjobTpl(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEditCronjobTpl();
  }

  deleteCronjobTpl(cronjobTpl: CronjobTpl) {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '确认',
      '你确认删除' + this.componentName + cronjobTpl.name + ' ？',
      cronjobTpl.id,
      ConfirmationTargets.CRONJOB_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editCronjobTpl(cronjobTpl: CronjobTpl) {
    this.createEdit.newOrEditCronjobTpl(cronjobTpl.id);
  }
}
