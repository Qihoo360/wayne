import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbService } from 'wayne-component/lib/client/v1/breadcrumb.service';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { DaemonSet } from 'wayne-component/lib/model/v1/daemonset';
import { Page } from 'wayne-component/lib/page/page-state';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';
import { Statefulset } from 'wayne-component/lib/model/v1/statefulset';

@Component({
  selector: 'list-daemonset',
  templateUrl: 'list-daemonset.component.html'
})
export class ListDaemonsetComponent implements OnInit {

  @Input() daemonsets: DaemonSet[];

  @Input() page: Page;
  state: ClrDatagridStateInterface;
  currentPage = 1;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<DaemonSet>();
  @Output() edit = new EventEmitter<DaemonSet>();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private aceEditorService: AceEditorService
  ) {
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

  deleteDaemonset(daemonset: DaemonSet) {
    this.delete.emit(daemonset);
  }

  editDaemonset(daemonset: DaemonSet) {
    this.edit.emit(daemonset);
  }

  goToLink(obj: Statefulset, gate: string) {
    let linkUrl = '';
    switch (gate) {
      case 'tpl':
        linkUrl = `/admin/daemonset/tpl?daemonSetId=${obj.id}`;
        break;
      case 'app':
        linkUrl = `admin/app?id=${obj.app.id}`;
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
