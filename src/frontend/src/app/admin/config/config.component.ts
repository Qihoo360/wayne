import {Component, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbService} from '../../shared/client/v1/breadcrumb.service';
import {State} from '@clr/angular';
import {ConfirmationDialogService} from '../../shared/confirmation-dialog/confirmation-dialog.service';
import {ConfirmationMessage} from '../../shared/confirmation-dialog/confirmation-message';
import {ConfirmationButtons, ConfirmationState, ConfirmationTargets} from '../../shared/shared.const';
import {Subscription} from 'rxjs/Subscription';
import {MessageHandlerService} from '../../shared/message-handler/message-handler.service';
import {ListConfigComponent} from './list-config/list-config.component';
import {CreateEditConfigComponent} from './create-edit-config/create-edit-config.component';
import {PageState} from '../../shared/page/page-state';
import {Config} from '../../shared/model/v1/config';
import {ConfigService} from '../../shared/client/v1/config.service';

@Component({
  selector: 'wayne-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  @ViewChild(ListConfigComponent)
  list: ListConfigComponent;
  @ViewChild(CreateEditConfigComponent)
  createEdit: CreateEditConfigComponent;

  pageState: PageState = new PageState();
  configs: Config[];

  subscription: Subscription;

  constructor(
    private configService: ConfigService,
    private breadcrumbService: BreadcrumbService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/config', '系统配置', false);
    breadcrumbService.addFriendlyNameForRoute('/admin/config/database', '数据库配置');
    breadcrumbService.addFriendlyNameForRoute('/admin/config/system', '文件配置');
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CONFIG) {
        let id = message.data;
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

  retrieve(state?: State): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.configService.list(this.pageState)
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.configs = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createConfig(created: boolean) {
    if (created) {
      this.retrieve()
    }
  }

  openModal(): void {
    this.createEdit.newOrEdit();
  }

  deleteConfig(config: Config) {
    let deletionMessage = new ConfirmationMessage(
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
