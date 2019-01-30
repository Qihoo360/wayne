import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { Page } from '../../page/page-state';

export class ListResourceTemplateComponent implements OnInit {

  @Input() templates: any[];

  @Input() page: Page;
  currentPage = 1;
  state: State;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();


  constructor(public router: Router) {
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

  deleteResourceTemplate(template: any) {
    this.delete.emit(template);
  }

  editResourceTemplate(template: any) {
    this.edit.emit(template);
  }
}
