import { EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { Page } from '../../page/page-state';
import { AceEditorService } from '../../ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../ace-editor/ace-editor';

export class ListResourceComponent  {
  @Input() resources: any[];

  @Input() page: Page;
  currentPage = 1;
  state: State;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();

  constructor(
    public breadcrumbService: BreadcrumbService,
    public router: Router,
    public aceEditorService: AceEditorService,
    public resourceType: string,
  ) {

    breadcrumbService.hideRoute(`/admin/${this.resourceType}/relate-tpl`);
    breadcrumbService.hideRoute(`/admin/${this.resourceType}/app`);
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state: State) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteResource(resource: any) {
    this.delete.emit(resource);
  }

  editResource(resource: any) {
    this.edit.emit(resource);
  }

  goToLink(resource: any, gate: string) {
    let linkUrl = new Array();
    switch (gate) {
      case 'tpl':
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/admin/${this.resourceType}/relate-tpl/[0-9]*`, '[' + resource.name + ']模板列表');
        linkUrl = ['admin', this.resourceType, 'relate-tpl', resource.id];
        break;
      case 'app':
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/admin/${this.resourceType}/app/[0-9]*`, '[' + resource.app.name + ']项目详情');
        linkUrl = ['admin', this.resourceType, 'app', resource.app.id];
        break;
      default:
        break;
    }
    this.router.navigate(linkUrl);
  }

  viewMetaDataTemplate(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
