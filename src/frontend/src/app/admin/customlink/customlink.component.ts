import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListCustomlinkComponent } from './list-customlink/list-customlink.component';
import { CreateEditCustomlinkComponent } from './create-edit-customlink/create-edit-customlink.component';
import { PageState } from '../../shared/page/page-state';
import { Customlink } from '../../shared/model/v1/customlink';
import { CustomlinkService } from '../../shared/client/v1/customlink.service';

@Component({
  selector: 'wayne-config',
  templateUrl: './customlink.component.html',
  styleUrls: ['./customlink.component.scss']
})
export class CustomlinkComponent implements OnInit, OnDestroy {
  @ViewChild(ListCustomlinkComponent, { static: false })
  list: ListCustomlinkComponent;
  @ViewChild(CreateEditCustomlinkComponent, { static: false })
  createEdit: CreateEditCustomlinkComponent;

  pageState: PageState = new PageState();
  configs: Customlink[];

  subscription: Subscription;

  constructor(
    private configService: CustomlinkService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {

    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CONFIG) {
        const id = message.data;
        this.configService
          .deleteById(id)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('配置删除成功！');
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
    this.configService.list(this.pageState)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.configs = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createConfig(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEdit();
  }

  deleteConfig(config: Customlink) {
    const deletionMessage = new ConfirmationMessage(
      '删除配置确认',
      '你确认删除配置 ' + config.linkType + ' ？',
      config.id,
      ConfirmationTargets.CONFIG,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  updateConfig(config: Customlink) {
    this.configService.updateStatus(config)
    .subscribe(res => {
      this.messageHandlerService.info(`${config.linkType}更新状态成功`);
      this.retrieve();
    });
  }

  editConfig(config: Customlink) {
    this.createEdit.newOrEdit(config.id);
  }
}
