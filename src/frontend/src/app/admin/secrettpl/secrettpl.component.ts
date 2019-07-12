import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ListSecretTplComponent } from './list-secrettpl/list-secrettpl.component';
import { CreateEditSecretTplComponent } from './create-edit-secrettpl/create-edit-secrettpl.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { SecretTpl } from '../../shared/model/v1/secrettpl';
import { SecretTplService } from '../../shared/client/v1/secrettpl.service';
import { PageState } from '../../shared/page/page-state';
import { isNotEmpty } from '../../shared/utils';

@Component({
  selector: 'wayne-secrettpl',
  templateUrl: './secrettpl.component.html',
  styleUrls: ['./secrettpl.component.scss']
})
export class SecretTplComponent implements OnInit, OnDestroy {
  @ViewChild(ListSecretTplComponent, { static: false })
  listSecrettpl: ListSecretTplComponent;
  @ViewChild(CreateEditSecretTplComponent, { static: false })
  createEditSecrettpl: CreateEditSecretTplComponent;

  pageState: PageState = new PageState();
  secretId: string;
  changedSecrettpls: SecretTpl[];
  componentName = '加密字典模板';

  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private secrettplService: SecretTplService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.SECRET_TPL) {
        const secrettplId = message.data;
        this.secrettplService.deleteById(secrettplId, 0)
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
      this.secretId = params['sid'];
      if (typeof (this.secretId) === 'undefined') {
        this.secretId = '';
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
    if (this.route.snapshot.queryParams) {
      Object.getOwnPropertyNames(this.route.snapshot.queryParams).map(key => {
        const value = this.route.snapshot.queryParams[key];
        if (isNotEmpty(value)) {
          this.pageState.filters[key] = value;
        }
      });
    }
    this.secrettplService.listPage(this.pageState, 0, this.secretId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedSecrettpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createSecrettpl(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  deleteSecrettpl(secrettpl: SecretTpl) {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '确认',
      '确认删除' + this.componentName + secrettpl.name + ' ？',
      secrettpl.id,
      ConfirmationTargets.SECRET_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  openModal(): void {
    this.createEditSecrettpl.newOrEditSecrettpl();
  }

  editSecrettpl(secrettpl: SecretTpl): void {
    this.createEditSecrettpl.newOrEditSecrettpl(secrettpl.id);
  }
}
