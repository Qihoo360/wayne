import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { CreateEditConfigMapTplComponent } from './create-edit-configmaptpl/create-edit-configmaptpl.component';
import { ListConfigMapTplComponent } from './list-configmaptpl/list-configmaptpl.component';
import { ConfigMapTpl } from '../../shared/model/v1/configmaptpl';
import { ConfigMapTplService } from '../../shared/client/v1/configmaptpl.service';
import { PageState } from '../../shared/page/page-state';
import { isNotEmpty } from '../../shared/utils';

@Component({
  selector: 'wayne-configmaptpl',
  templateUrl: './configmaptpl.component.html',
  styleUrls: ['./configmaptpl.component.scss']
})
export class ConfigMapTplComponent implements OnInit, OnDestroy {
  @ViewChild(ListConfigMapTplComponent, { static: false })
  list: ListConfigMapTplComponent;
  @ViewChild(CreateEditConfigMapTplComponent, { static: false })
  createEdit: CreateEditConfigMapTplComponent;

  pageState: PageState = new PageState();
  configmapId: string;
  configMapTpls: ConfigMapTpl[];

  subscription: Subscription;

  constructor(
    private configMapTplService: ConfigMapTplService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CONFIGMAP_TPL) {
        const id = message.data;
        this.configMapTplService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('配置集模版删除成功！');
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
      this.configmapId = params['cid'];
      if (typeof (this.configmapId) === 'undefined') {
        this.configmapId = '';
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
    this.configMapTplService.listPage(this.pageState, 0, this.configmapId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.configMapTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createConfigMapTpl(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEditConfigMapTpl();
  }

  deleteConfigMapTpl(configMapTpl: ConfigMapTpl) {
    const deletionMessage = new ConfirmationMessage(
      '删除配置集模版确认',
      '你确认删除配置集模版 ' + configMapTpl.name + ' ？',
      configMapTpl.id,
      ConfirmationTargets.CONFIGMAP_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editConfigMapTpl(configMapTpl: ConfigMapTpl) {
    this.createEdit.newOrEditConfigMapTpl(configMapTpl.id);
  }
}
