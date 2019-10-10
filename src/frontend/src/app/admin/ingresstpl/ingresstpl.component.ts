import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListIngressTplComponent } from './list-ingresstpl/list-ingresstpl.component';
import { CreateEditIngressTplComponent } from './create-edit-ingresstpl/create-edit-ingresstpl.component';
import { IngressTplService } from '../../shared/client/v1/ingresstpl.service';
import { IngressTpl } from '../../shared/model/v1/ingresstpl';
import { PageState } from '../../shared/page/page-state';
import { isNotEmpty } from '../../shared/utils';

@Component({
  selector: 'wayne-ingresstpl',
  templateUrl: './ingresstpl.component.html',
  styleUrls: ['./ingresstpl.component.scss']
})
export class IngressTplComponent implements OnInit, OnDestroy {
  @ViewChild(ListIngressTplComponent, { static: false })
  list: ListIngressTplComponent;
  @ViewChild(CreateEditIngressTplComponent, { static: false })
  createEdit: CreateEditIngressTplComponent;

  pageState: PageState = new PageState({pageSize: 10});
  ingressTpls: IngressTpl[];
  ingressId: string;
  componentName = 'Ingress 模板';

  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private ingressTplService: IngressTplService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.SERVICE_TPL) {
        const id = message.data;
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
      this.ingressId = params['gid'];
      if (typeof(this.ingressId) === 'undefined') {
        this.ingressId = '';
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
      this.pageState =
        PageState.fromState(state, {pageSize: 10, totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
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
    this.ingressTplService.listPage(this.pageState, 0, this.ingressId)
      .subscribe(
        response => {
          const data = response.data;
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
    const deletionMessage = new ConfirmationMessage(
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
