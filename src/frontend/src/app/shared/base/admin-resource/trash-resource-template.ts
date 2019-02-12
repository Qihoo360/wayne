import { OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { ConfirmationMessage } from '../../confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared.const';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { AceEditorService } from '../../ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../ace-editor/ace-editor';
import { PageState } from '../../page/page-state';

export class TrashResourceTemplateComponent implements OnInit, OnDestroy {

  templates: any[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(public resourceTemplateService: any,
              public messageHandlerService: MessageHandlerService,
              public deletionDialogService: ConfirmationDialogService,
              public aceEditorService: AceEditorService,
              public componentName: string,
              public resourceType: string,
              public confirmationTargets: ConfirmationTargets) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === confirmationTargets) {
        const id = message.data;
        this.resourceTemplateService
          .deleteById(id, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(`${resourceType} 删除成功！`);
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
    this.resourceTemplateService.listPage(this.pageState, 0)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.templates = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteResourceTemplate(template: any) {
    const deletionMessage = new ConfirmationMessage(
      `删除 ${this.resourceType} 确认`,
      `你确认永久删除 ${this.resourceType} ${template.name}  ？删除后将不可恢复！`,
      template.id,
      this.confirmationTargets,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  viewResourceTemplate(template: any) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(template.template, false, '详情'));
  }

  recoverResourceTemplate(template: any) {
    template.deleted = false;
    this.resourceTemplateService.update(template, 0)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess(`${this.resourceType}  模版恢复成功！`);
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
