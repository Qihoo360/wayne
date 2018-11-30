import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { State } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { CreateEditConfigMapComponent } from './create-edit-configmap/create-edit-configmap.component';
import { ListConfigMapComponent } from './list-configmap/list-configmap.component';
import { ConfigMap } from '../../shared/model/v1/configmap';
import { ConfigMapService } from '../../shared/client/v1/configmap.service';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-configmap',
  templateUrl: './configmap.component.html',
  styleUrls: ['./configmap.component.scss']
})
export class ConfigMapComponent implements OnInit {
  @ViewChild(ListConfigMapComponent)
  list: ListConfigMapComponent;
  @ViewChild(CreateEditConfigMapComponent)
  createEdit: CreateEditConfigMapComponent;

  pageState: PageState = new PageState();
  configMaps: ConfigMap[];

  subscription: Subscription;

  constructor(
    private configMapService: ConfigMapService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/configmap', '配置集列表');
    breadcrumbService.addFriendlyNameForRoute('/admin/configmap/trash', '已删除配置集列表');
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CONFIGMAP) {
        let id = message.data;
        this.configMapService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('配置集删除成功！');
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
    this.configMapService.list(this.pageState, 'false', '0')
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.configMaps = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createConfigMap(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEditConfigMap();
  }

  deleteConfigMap(configMap: ConfigMap) {
    let deletionMessage = new ConfirmationMessage(
      '删除配置集确认',
      '你确认删除配置集 ' + configMap.name + ' ？',
      configMap.id,
      ConfirmationTargets.CONFIGMAP,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editConfigMap(configMap: ConfigMap) {
    this.createEdit.newOrEditConfigMap(configMap.id, configMap.appId);
  }
}
