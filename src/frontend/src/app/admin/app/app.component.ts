import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { State } from '@clr/angular';
import { ListAppComponent } from './list-app/list-app.component';
import { CreateEditAppComponent } from './create-edit-app/create-edit-app.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { App } from '../../shared/model/v1/app';
import { AppService } from '../../shared/client/v1/app.service';
import { NamespaceService } from '../../shared/client/v1/namespace.service';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(ListAppComponent)
  listApp: ListAppComponent;
  @ViewChild(CreateEditAppComponent)
  createEditApp: CreateEditAppComponent;

  namespaceId: string;
  idFilterInit: string = '';
  changedApps: App[];
  pageState: PageState = new PageState();
  subscription: Subscription;

  constructor(private breadcrumbService: BreadcrumbService,
              private appService: AppService,
              private route: ActivatedRoute,
              private messageHandlerService: MessageHandlerService,
              private namespaceService: NamespaceService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.APP) {
        let appId = message.data;
        this.appService.deleteById(appId, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('项目删除成功！');
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
      this.namespaceId = params['nid'];
      if (typeof (this.namespaceId) === 'undefined') {
        this.namespaceId = '';
      }
      if (typeof (params['aid']) !== 'undefined') {
        this.idFilterInit = params['aid'];
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
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.params['deleted'] = false;
    this.pageState.params['relate'] = 'namespace';
    this.appService.listPage(this.pageState, this.namespaceId)
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedApps = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createApp(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEditApp.newOrEditApp();
  }

  deleteApp(app: App) {
    let deletionMessage = new ConfirmationMessage(
      '删除项目确认',
      '你确认删除项目 ' + app.name + ' ？',
      app.id,
      ConfirmationTargets.APP,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editApp(app: App) {
    this.createEditApp.newOrEditApp(app.id);
  }
}
