import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { State } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets} from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListIngressTplComponent } from './list-ingresstpl/list-ingresstpl.component';
import { CreateEditIngressTplComponent } from './create-edit-ingresstpl/create-edit-ingresstpl.component';
import { IngressTplService } from '../../shared/client/v1/ingresstpl.service';
import { IngressTpl } from '../../shared/model/v1/ingresstpl';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-ingresstpl',
  templateUrl: './ingresstpl.component.html',
  styleUrls: ['./ingresstpl.component.scss']
})
export class IngressTplComponent implements OnInit, OnDestroy {
  @ViewChild(ListIngressTplComponent)
  list: ListIngressTplComponent;
  @ViewChild(CreateEditIngressTplComponent)
  createEdit: CreateEditIngressTplComponent;

  pageState: PageState = new PageState({pageSize: 10});
  ingressTpls: IngressTpl[];
  serviceId: string;
  componentName = 'Ingress 模板';

  subscription: Subscription;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private ingressTplService: IngressTplService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/ingress/tpl', this.componentName + '列表');
    breadcrumbService.addFriendlyNameForRoute('/admin/ingress/tpl/trash', '已删除' + this.componentName + '列表');
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.SERVICE_TPL) {
        let id = message.data;
        this.ingressTplService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('Ingress 模版删除成功！');
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
      this.serviceId = params['sid'];
      if (typeof(this.serviceId) === 'undefined') {
        this.serviceId = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  retrieve(state?: State): void {
    if (state) {
      this.pageState = PageState.fromState(state, {pageSize: 10, totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.params['deleted'] = false;
    this.ingressTplService.listPage(this.pageState, 0, this.serviceId)
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.ingressTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createIngressTpl(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEditServiceTpl();
  }

  deleteIngressTpl(ingressTpl: IngressTpl) {
    let deletionMessage = new ConfirmationMessage(
      '删除 Ingress 模版确认',
      '你确认删除 Ingress 模版 ' + ingressTpl.name + ' ？',
      ingressTpl.id,
      ConfirmationTargets.INGRESS_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editIngressTpl(ingressTpl: IngressTpl) {
    this.createEdit.newOrEditServiceTpl(ingressTpl.id);
  }
}
