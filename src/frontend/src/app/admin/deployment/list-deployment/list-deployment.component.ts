import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Deployment } from '../../../shared/model/v1/deployment';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-deployment',
  templateUrl: 'list-deployment.component.html'
})
export class ListDeploymentComponent {

  @Input() deployments: Deployment[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;
  testInfo = 0;
  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<Deployment>();
  @Output() edit = new EventEmitter<Deployment>();

  constructor( private router: Router, private aceEditorService: AceEditorService) {}

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

  deleteDeployment(deployment: Deployment) {
    this.delete.emit(deployment);
  }

  editDeployment(deployment: Deployment) {
    this.edit.emit(deployment);
  }

  goToLink(deployment: Deployment, gate: string) {
    let linkUrl = '';
    switch (gate) {
      case 'tpl':
        linkUrl = `/admin/deployment/tpl?deploymentId=${deployment.id}`;
        break;
      case 'app':
        linkUrl = `admin/app?id=${deployment.app.id}`;
        break;
      default:
        break;
    }
    this.router.navigateByUrl(linkUrl);
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
