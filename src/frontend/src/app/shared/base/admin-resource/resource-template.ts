import { OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { PageState } from '../../page/page-state';
import { CreateEditResourceTemplateComponent } from './create-edit-resource-template';
import { ListResourceTemplateComponent } from './list-resource-template';
import { isNotEmpty } from '../../utils';

export class ResourceTemplateComponent implements OnInit, OnDestroy {
  // @ViewChild(CreateEditResourceTemplateComponent)
  listResourceTemplateComponent: ListResourceTemplateComponent;
  // @ViewChild(CreateEditResourceTemplateComponent)
  createEditResourceTemplateComponent: CreateEditResourceTemplateComponent;

  pageState: PageState = new PageState({pageSize: 10});
  templates: any[];
  resourceId: string;
  // componentName = 'Ingress 模板';

  subscription: Subscription;

  constructor(
    public breadcrumbService: BreadcrumbService,
    public route: ActivatedRoute,
    public resourceTemplateService: any,
    public messageHandlerService: MessageHandlerService,
    public deletionDialogService: ConfirmationDialogService,
    public componentName: string,
    public resourceType: string,
    public confirmationTargets: ConfirmationTargets) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === confirmationTargets) {
        const id = message.data;
        this.resourceTemplateService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(`${this.componentName}删除成功！`);
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
      this.resourceId = params['gid'];
      if (typeof (this.resourceId) === 'undefined') {
        this.resourceId = '';
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
    this.resourceTemplateService.listPage(this.pageState, 0, this.resourceId)
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

  createResourceTemplate(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEditResourceTemplateComponent.newOrEditResourceTemplate();
  }

  deleteResourceTemplate(template: any) {
    const deletionMessage = new ConfirmationMessage(
      `删除 ${this.componentName}确认`,
      `你确认删除 ${this.componentName}` + template.name + ' ？',
      template.id,
      this.confirmationTargets,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editResourceTemplate(template: any) {
    this.createEditResourceTemplateComponent.newOrEditResourceTemplate(template.id);
  }
}
