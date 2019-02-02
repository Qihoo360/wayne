import { EventEmitter, Input, Output } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../page/page-state';
import { TplDetailService } from '../../tpl-detail/tpl-detail.service';

export class KubernetesNamespacedListResource {
  state: ClrDatagridStateInterface;
  currentPage = 1;

  @Input() page: Page;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  constructor(public tplDetailService: TplDetailService) {
  }

  versionDetail(version: string) {
    this.tplDetailService.openModal(version, 'ADMIN.KUBERNETES.TITLE.DETAIL');
  }

  onEditEvent(obj: any) {
    this.edit.emit(obj);
  }

  onDeleteEvent(obj: any) {
    this.delete.emit(obj);
  }

  refresh(state: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }
}
