import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../../shared/page/page-state';
import { StatefulsetTemplate } from '../../../shared/model/v1/statefulsettpl';

@Component({
  selector: 'list-statefulsettpl',
  templateUrl: 'list-statefulsettpl.component.html'
})
export class ListStatefulsettplComponent implements OnInit {

  @Input() statefulsetTpls: StatefulsetTemplate[];

  @Input() page: Page;
  state: ClrDatagridStateInterface;
  currentPage = 1;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<StatefulsetTemplate>();
  @Output() edit = new EventEmitter<StatefulsetTemplate>();


  constructor(private router: Router) {
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

  deleteStatefulsetTpl(template: StatefulsetTemplate) {
    this.delete.emit(template);
  }

  editStatefulsetTpl(template: StatefulsetTemplate) {
    this.edit.emit(template);
  }
}
