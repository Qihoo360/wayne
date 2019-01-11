import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { DaemonSet } from '../../../shared/model/v1/daemonset';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-daemonset',
  templateUrl: 'list-daemonset.component.html'
})
export class ListDaemonsetComponent implements OnInit {

  @Input() daemonsets: DaemonSet[];

  @Input() page: Page;
  state: State;
  currentPage = 1;

  @Output() paginate = new EventEmitter<State>();
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


  refresh(state: State) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteDaemonset(daemonset: DaemonSet) {
    this.delete.emit(daemonset);
  }

  editDaemonset(daemonset: DaemonSet) {
    this.edit.emit(daemonset);
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
