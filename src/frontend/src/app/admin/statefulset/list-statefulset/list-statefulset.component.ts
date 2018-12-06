import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { Statefulset } from '../../../shared/model/v1/statefulset';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-statefulset',
  templateUrl: 'list-statefulset.component.html'
})
export class ListStatefulsetComponent implements OnInit {

  @Input() statefulsets: Statefulset[];

  @Input() page: Page;
  state: State;
  currentPage: number = 1;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<Statefulset>();
  @Output() edit = new EventEmitter<Statefulset>();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private aceEditorService: AceEditorService
  ) {
    breadcrumbService.hideRoute('/admin/statefulset/relate-tpl');
    breadcrumbService.hideRoute('/admin/statefulset/app');
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

  deleteStatefulset(statefulset: Statefulset) {
    this.delete.emit(statefulset);
  }

  editStatefulset(statefulset: Statefulset) {
    this.edit.emit(statefulset);
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
