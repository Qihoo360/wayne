import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { App } from '../../../shared/model/v1/app';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-app',
  templateUrl: 'list-app.component.html'
})
export class ListAppComponent implements OnInit {

  @Input() apps: App[];
  @Input() idFilterInit: string;
  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<App>();
  @Output() edit = new EventEmitter<App>();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private aceEditorService: AceEditorService
  ) {
    breadcrumbService.hideRoute('/admin/app/user');
    breadcrumbService.hideRoute('/admin/app/deployment');
    breadcrumbService.hideRoute('/admin/app/secret');
    breadcrumbService.hideRoute('/admin/app/configmap');
    breadcrumbService.hideRoute('/admin/app/service');
  }

  ngOnInit(): void {
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteApp(app: App) {
    this.delete.emit(app);
  }

  editApp(app: App) {
    this.edit.emit(app);
  }

  goToLink(app: App, gate: string) {
    let linkUrl = new Array();
    switch (gate) {
      case 'deploy':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/app/deployment/[0-9]*', '[' + app.name + ']部署列表');
        linkUrl = ['admin', 'app', 'deployment', app.id];
        break;
      case 'user':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/app/user/[0-9]*', '[' + app.name + ']用户列表');
        linkUrl = ['admin', 'app', 'user', app.id];
        break;
      case 'service':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/app/service/[0-9]*', '[' + app.name + ']服务列表');
        linkUrl = ['admin', 'app', 'service', app.id];
        break;
      case 'secret':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/app/secret/[0-9]*', '[' + app.name + ']加密字典列表');
        linkUrl = ['admin', 'app', 'secret', app.id];
        break;
      case 'configmap':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/app/configmap/[0-9]*', '[' + app.name + ']配置集列表');
        linkUrl = ['admin', 'app', 'configmap', app.id];
        break;
      default:
        break;
    }
    this.router.navigate(linkUrl);
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
