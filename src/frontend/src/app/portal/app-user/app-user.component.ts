import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ListAppUserComponent } from './list-app-user/list-app-user.component';
import { CreateEditAppUserComponent } from './create-edit-app-user/create-edit-app-user.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { AppUser } from '../../shared/model/v1/app-user';
import { AppUserService } from '../../shared/client/v1/app-user.service';
import { AuthService } from '../../shared/auth/auth.service';
import { PageState } from '../../shared/page/page-state';

const showState = {
  'user_name': {hidden: false},
  'app_name': {hidden: false},
  'group': {hidden: false},
  'create_time': {hidden: false},
  'action': {hidden: false}
};

@Component({
  selector: 'wayne-app-user',
  templateUrl: './app-user.component.html',
  styleUrls: ['./app-user.component.scss']
})
export class AppUserComponent implements OnInit, OnDestroy {
  @ViewChild(ListAppUserComponent, { static: false })
  listAppUser: ListAppUserComponent;
  @ViewChild(CreateEditAppUserComponent, { static: false })
  createEditAppUser: CreateEditAppUserComponent;

  pageState: PageState = new PageState();
  resourceId: string;
  listType: string;
  changedAppUsers: AppUser[];
  componentName = '项目用户';
  showList: any[] = new Array();
  showState: object = showState;
  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private breadcrumbService: BreadcrumbService,
              public authService: AuthService,
              private appUserService: AppUserService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.APP_USER) {
        const appUser = message.data;
        this.appUserService.deleteById(appUser.id, appUser.app.id)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(this.componentName + '删除成功！');
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
    if (typeof (this.route.parent.snapshot.params['id']) !== 'undefined') {
      this.resourceId = this.route.parent.snapshot.params['id'];
      this.listType = 'app';
    } else {
      this.route.params.subscribe(params => {
        this.resourceId = '';
        if (typeof (params['aid']) !== 'undefined') {
          this.resourceId = params['aid'];
          this.listType = 'app';
        } else if (typeof (params['uid']) !== 'undefined') {
          this.resourceId = params['uid'];
          this.listType = 'user';
        }
      });
    }
    this.initShow();
  }

  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) { this.showList.push(key); }
    });
  }

  confirmEvent() {
    Object.keys(this.showState).forEach(key => {
      if (this.showList.indexOf(key) > -1) {
        this.showState[key] = {hidden: false};
      } else {
        this.showState[key] = {hidden: true};
      }
    });
  }

  cancelEvent() {
    this.initShow();
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
    this.appUserService.list(this.pageState, this.listType, this.resourceId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedAppUsers = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createAppUser(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    if (this.listType === 'app') {
      this.createEditAppUser.newOrEditAppUser(this.resourceId);
    }
  }

  deleteAppUser(appUser: AppUser) {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '确认',
      '你确认删除 ' + this.componentName + appUser.user.name + ' ？',
      appUser,
      ConfirmationTargets.APP_USER,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editAppUser(appUser: AppUser) {
    this.createEditAppUser.newOrEditAppUser(appUser.app.id.toString(), appUser.id);
  }
}
