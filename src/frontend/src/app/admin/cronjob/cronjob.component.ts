import {Component, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbService} from '../../shared/client/v1/breadcrumb.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {State} from '@clr/angular';
import {ConfirmationDialogService} from '../../shared/confirmation-dialog/confirmation-dialog.service';
import {ConfirmationMessage} from '../../shared/confirmation-dialog/confirmation-message';
import {ConfirmationButtons, ConfirmationState, ConfirmationTargets} from '../../shared/shared.const';
import {Subscription} from 'rxjs/Subscription';
import {MessageHandlerService} from '../../shared/message-handler/message-handler.service';
import {CreateEditCronjobComponent} from './create-edit-cronjob/create-edit-cronjob.component';
import {ListCronjobComponent} from './list-cronjob/list-cronjob.component';
import {Cronjob} from '../../shared/model/v1/cronjob';
import {CronjobService} from '../../shared/client/v1/cronjob.service';
import {PageState} from '../../shared/page/page-state';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'wayne-cronjob',
  templateUrl: './cronjob.component.html',
  styleUrls: ['./cronjob.component.scss']
})
export class CronjobComponent implements OnInit {
  @ViewChild(ListCronjobComponent)
  list: ListCronjobComponent;
  @ViewChild(CreateEditCronjobComponent)
  createEdit: CreateEditCronjobComponent;

  pageState: PageState = new PageState();
  appId: string;
  cronjobs: Cronjob[];

  subscription: Subscription;
  componentName = '计划任务';

  constructor(
    private cronjobService: CronjobService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    public translate: TranslateService,
    private deletionDialogService: ConfirmationDialogService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/cronjob', this.componentName + '列表');
    breadcrumbService.addFriendlyNameForRoute('/admin/cronjob/trash', '已删除' + this.componentName + '列表');
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CRONJOB) {
        let id = message.data;
        this.cronjobService.deleteById(id, 0)
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
      this.appId = params['aid'];
      if (typeof(this.appId) == 'undefined') {
          this.appId = ''
      }
    })
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
    this.cronjobService.list(this.pageState, 'false', this.appId)
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.cronjobs = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createCronjob(created: boolean) {
    if (created) {
      this.retrieve()
    }
  }

  openModal(): void {
    this.createEdit.newOrEditCronjob();
  }

  deleteCronjob(cronjob: Cronjob) {
    let deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '确认',
      '你确认删除' + this.componentName  + cronjob.name + ' ？',
      cronjob.id,
      ConfirmationTargets.CRONJOB,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editCronjob(cronjob: Cronjob) {
    this.createEdit.newOrEditCronjob(cronjob.id);
  }
}
