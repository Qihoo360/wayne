import { ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subscription } from 'rxjs/Subscription';
import { PageState } from '../../page/page-state';
import { BreadcrumbService } from '../../client/v1/breadcrumb.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared.const';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { ListResourceComponent } from './list-resource';
import { CreateEditResourceComponent } from './create-edit-resource';

export class ResourceComponent implements OnInit, OnDestroy {
  // @ViewChild(ListResourceComponent)
  listResourceComponent: ListResourceComponent;
  // @ViewChild(CreateEditResourceComponent)
  createEditResourceComponent: CreateEditResourceComponent;

  pageState: PageState = new PageState();
  resources: any[];
  appId: string;

  subscription: Subscription;

  constructor(
    public breadcrumbService: BreadcrumbService,
    public route: ActivatedRoute,
    public resourceService: any,
    public messageHandlerService: MessageHandlerService,
    public deletionDialogService: ConfirmationDialogService,
    public componentName: string,
    public confirmationTarget: ConfirmationTargets) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === this.confirmationTarget) {
        const id = message.data;
        this.resourceService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(`${this.componentName} 删除成功！`);
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
    this.resourceService.list(this.pageState, 'false', this.appId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.resources = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createResource(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEditResourceComponent.newOrEditResource();
  }

  deleteResource(resource: any) {
    const deletionMessage = new ConfirmationMessage(
      `删除 ${this.componentName} 确认`,
      '你确认删除 ${this.componentName} ' +  resource.name + ' ？',
      resource.id,
      this.confirmationTarget,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editResource(resource: any) {
    this.createEditResourceComponent.newOrEditResource(resource.id);
  }
}
