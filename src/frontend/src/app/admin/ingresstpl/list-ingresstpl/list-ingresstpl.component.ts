import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { IngressTpl } from '../../../shared/model/v1/ingresstpl';
import { Page } from '../../../shared/page/page-state';

@Component({
  selector: 'list-ingresstpl',
  templateUrl: 'list-ingresstpl.component.html'
})
export class ListIngressTplComponent implements OnInit {

  @Input() ingressTpls: IngressTpl[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<IngressTpl>();
  @Output() edit = new EventEmitter<IngressTpl>();


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

  deleteIngressTpl(ingressTpl: IngressTpl) {
    this.delete.emit(ingressTpl);
  }

  editIngressTpl(ingressTpl: IngressTpl) {
    this.edit.emit(ingressTpl);
  }
}
