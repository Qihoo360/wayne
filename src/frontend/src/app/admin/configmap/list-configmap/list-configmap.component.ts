import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { ConfigMap } from '../../../shared/model/v1/configmap';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-configmap',
  templateUrl: 'list-configmap.component.html'
})
export class ListConfigMapComponent implements OnInit {

  @Input() configMaps: ConfigMap[];

  @Input() page: Page;
  state: State;
  currentPage = 1;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<ConfigMap>();
  @Output() edit = new EventEmitter<ConfigMap>();


  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private aceEditorService: AceEditorService
  ) {
    breadcrumbService.hideRoute('/admin/configmap/relate-tpl');
    breadcrumbService.hideRoute('/admin/configmap/app');
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

  deleteConfigMap(configMap: ConfigMap) {
    this.delete.emit(configMap);
  }

  editConfigMap(configMap: ConfigMap) {
    this.edit.emit(configMap);
  }

  goToLink(configmap: ConfigMap, gate: string) {
    let linkUrl = new Array();
    switch (gate) {
      case 'tpl':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/configmap/relate-tpl/[0-9]*', '[' + configmap.name + ']模板列表');
        linkUrl = ['admin', 'configmap', 'relate-tpl', configmap.id];
        break;
      case 'app':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/configmap/app/[0-9]*', '[' + configmap.app.name + ']项目详情');
        linkUrl = ['admin', 'configmap', 'app', configmap.app.id];
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
