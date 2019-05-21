import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from 'wayne-component';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { AppService } from 'wayne-component/lib/client/v1/app.service';
import { App } from 'wayne-component/lib/model/v1/app';
import { PageState } from 'wayne-component/lib/page/page-state';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';

@Component({
  selector: 'trash-app',
  templateUrl: 'trash-app.component.html'
})
export class TrashAppComponent implements OnInit, OnDestroy {

  apps: App[];
  currentPage = 1;
  state: ClrDatagridStateInterface;

  pageState: PageState = new PageState();

  subscription: Subscription;

  constructor(private appService: AppService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_APP) {
        const appId = message.data;
        this.appService.deleteById(appId, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('项目删除成功！');
              this.refresh();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.refresh(this.state);
  }

  refresh(state?: ClrDatagridStateInterface) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.params['deleted'] = true;
    this.appService
      .listPage(this.pageState)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.apps = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteApp(app: App) {
    const deletionMessage = new ConfirmationMessage(
      '删除项目确认',
      '你确认永久删除项目 ' + app.name + ' ？删除后将不可恢复！',
      app.id,
      ConfirmationTargets.TRASH_APP,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  recoverApp(app: App) {
    app.deleted = false;
    this.appService
      .update(app)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('项目恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
