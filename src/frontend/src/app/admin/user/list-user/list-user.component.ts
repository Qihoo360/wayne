import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { User } from '../../../shared/model/v1/user';
import { UserService } from '../../../shared/client/v1/user.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { Page } from '../../../shared/page/page-state';

@Component({
  selector: 'list-user',
  templateUrl: 'list-user.component.html'
})
export class ListUserComponent implements OnInit {
  @ViewChild(ResetPasswordComponent, { static: false })
  resetPasswordComponent: ResetPasswordComponent;
  @Input() users: User[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<User>();
  @Output() edit = new EventEmitter<User>();

  constructor(
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private messageHandlerService: MessageHandlerService,
    private router: Router) {
    breadcrumbService.hideRoute('/admin/system/user/app');
  }

  ngOnInit(): void {
  }

  resetPassword(user: User) {
    this.resetPasswordComponent.resetPassword(user);
  }

  changeAdminRole(user: User) {
    user.admin = !user.admin;
    this.userService.updateUserAdmin(user).subscribe(
      resp => {
        this.refresh();
        this.messageHandlerService.showSuccess('更新管理员权限成功！');
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  adminActions(user: User): string {
    if (!user) {
      return '用户不存在';
    }
    const show = user.admin ? '取消管理员' : '设置为管理员';
    return show;
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state?: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteUser(user: User) {
    this.delete.emit(user);
  }

  editUser(user: User) {
    this.edit.emit(user);
  }

  goToLink(user: User, gate: string) {
    let linkUrl = new Array();
    switch (gate) {
      case 'app':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/system/user/app/[0-9]*', '[' + user.name + ']项目列表');
        linkUrl = ['admin', 'system', 'user', 'app', user.id];
        break;
      default:
        break;
    }
    this.router.navigate(linkUrl);
  }
}
