import { EventEmitter, Input, Output } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { NamespaceList } from '../../model/v1/namespace-list';
import { Page } from '../../page/page-state';

export class KubernetesListResource {
  state: ClrDatagridStateInterface;
  currentPage = 1;

  @Input() page: Page;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() detail = new EventEmitter<NamespaceList>();

  onDetailEvent(obj: any) {
    this.detail.emit(obj);
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
