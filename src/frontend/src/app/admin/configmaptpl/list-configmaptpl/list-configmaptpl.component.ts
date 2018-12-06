import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { ConfigMapTpl } from '../../../shared/model/v1/configmaptpl';
import { Page } from '../../../shared/page/page-state';

@Component({
  selector: 'list-configmaptpl',
  templateUrl: 'list-configmaptpl.component.html'
})
export class ListConfigMapTplComponent implements OnInit {

  @Input() configMapTpls: ConfigMapTpl[];

  @Input() page: Page;
  state: State;
  currentPage: number = 1;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<ConfigMapTpl>();
  @Output() edit = new EventEmitter<ConfigMapTpl>();


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


  refresh(state: State) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteConfigMapTpl(configMapTpl: ConfigMapTpl) {
    this.delete.emit(configMapTpl);
  }

  editConfigMapTpl(configMapTpl: ConfigMapTpl) {
    this.edit.emit(configMapTpl);
  }
}
