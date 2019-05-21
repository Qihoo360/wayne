import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from 'wayne-component';
import { ListIngressComponent } from './list-ingress/list-ingress.component';
import { CreateEditIngressComponent } from './create-edit-ingress/create-edit-ingress.component';
import { Ingress } from 'wayne-component/lib/model/v1/ingress';
import { IngressService } from 'wayne-component/lib/client/v1/ingress.service';
import { PageState } from 'wayne-component/lib/page/page-state';

@Component({
  selector: 'wayne-ingress',
  templateUrl: './ingress.component.html',
  styleUrls: ['./ingress.component.scss']
})
export class IngressComponent implements OnInit, OnDestroy {
  @ViewChild(ListIngressComponent)
  list: ListIngressComponent;
  @ViewChild(CreateEditIngressComponent)
  createEdit: CreateEditIngressComponent;

  pageState: PageState = new PageState();
  ingresses: Ingress[];
  appId: string;
  componentName = 'Ingress';

  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private ingressService: IngressService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.INGRESS) {
        const id = message.data;
        this.ingressService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('Ingress 删除成功！');
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
      if (typeof(this.appId) === 'undefined') {
        this.appId = '';
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
    this.ingressService.list(this.pageState, 'false', this.appId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.ingresses = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createIngress(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEditIngress();
  }

  deleteIngress(ingress: Ingress) {
    const deletionMessage = new ConfirmationMessage(
      '删除 Ingress 确认',
      '你确认删除 Ingress ' +  ingress.name + ' ？',
      ingress.id,
      ConfirmationTargets.INGRESS,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editIngress(ingress: Ingress) {
    this.createEdit.newOrEditIngress(ingress.id);
  }
}
