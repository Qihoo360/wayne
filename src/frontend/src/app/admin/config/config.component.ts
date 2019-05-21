import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from 'wayne-component';
import { ListConfigComponent } from './list-config/list-config.component';
import { CreateEditConfigComponent } from './create-edit-config/create-edit-config.component';
import { PageState } from 'wayne-component/lib/page/page-state';
import { Config } from 'wayne-component/lib/model/v1/config';
import { ConfigService } from 'wayne-component/lib/client/v1/config.service';

@Component({
  selector: 'wayne-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnDestroy {
  @ViewChild(ListConfigComponent)
  list: ListConfigComponent;
  @ViewChild(CreateEditConfigComponent)
  createEdit: CreateEditConfigComponent;

  pageState: PageState = new PageState();
  configs: Config[];

  subscription: Subscription;

  constructor(
    private configService: ConfigService,
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

  deleteConfig(config: Config) {
    const deletionMessage = new ConfirmationMessage(
      '删除配置确认',
      '你确认删除配置 ' + config.name + ' ？',
      config.id,
      ConfirmationTargets.CONFIG,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editConfig(config: Config) {
    this.createEdit.newOrEdit(config.id);
  }
}
