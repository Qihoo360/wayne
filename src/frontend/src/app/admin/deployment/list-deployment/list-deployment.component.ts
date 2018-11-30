import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { Deployment } from '../../../shared/model/v1/deployment';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-deployment',
  templateUrl: 'list-deployment.component.html'
})
export class ListDeploymentComponent implements OnInit {

  @Input() deployments: Deployment[];

  @Input() page: Page;
  currentPage: number = 1;
  state: State;
  testInfo: number = 0;
  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<Deployment>();
  @Output() edit = new EventEmitter<Deployment>();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private aceEditorService: AceEditorService
  ) {
    breadcrumbService.hideRoute('/admin/deployment/relate-tpl');
    breadcrumbService.hideRoute('/admin/deployment/app');
  }

  ngOnInit(): void {
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

  deleteDeployment(deployment: Deployment) {
    this.delete.emit(deployment);
  }

  editDeployment(deployment: Deployment) {
    this.edit.emit(deployment);
  }

  goToLink(deployment: Deployment, gate: string) {
    let linkUrl = new Array();
    switch (gate) {
      case 'tpl':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/deployment/relate-tpl/[0-9]*', '[' + deployment.name + ']模板列表');
        linkUrl = ['admin', 'deployment', 'relate-tpl', deployment.id];
        break;
      case 'app':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/deployment/app/[0-9]*', '[' + deployment.app.name + ']项目详情');
        linkUrl = ['admin', 'deployment', 'app', deployment.app.id];
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
