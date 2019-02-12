import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Cronjob } from '../../../shared/model/v1/cronjob';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-cronjob',
  templateUrl: 'list-cronjob.component.html'
})
export class ListCronjobComponent implements OnInit {

  @Input() cronjobs: Cronjob[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<Cronjob>();
  @Output() edit = new EventEmitter<Cronjob>();


  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private aceEditorService: AceEditorService
  ) {
    breadcrumbService.hideRoute('/admin/cronjob/relate-tpl');
    breadcrumbService.hideRoute('/admin/cronjob/app');
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

  deleteCronjob(cronjob: Cronjob) {
    this.delete.emit(cronjob);
  }

  editCronjob(cronjob: Cronjob) {
    this.edit.emit(cronjob);
  }

  goToLink(obj: Cronjob, gate: string) {
    let linkUrl = '';
    switch (gate) {
      case 'tpl':
        linkUrl = `/admin/cronjob/tpl?cronjobId=${obj.id}`;
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
