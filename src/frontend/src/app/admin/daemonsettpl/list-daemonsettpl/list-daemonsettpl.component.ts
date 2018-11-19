import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {State} from '@clr/angular';
import {Page} from '../../../shared/page/page-state';
import {DaemonSetTemplate} from '../../../shared/model/v1/daemonsettpl';

@Component({
  selector: 'list-daemonsettpl',
  templateUrl: 'list-daemonsettpl.component.html'
})
export class ListDaemonsettplComponent implements OnInit {

  @Input() daemonsetTpls: DaemonSetTemplate[];

  @Input() page: Page;
  state: State;
  currentPage: number = 1;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<DaemonSetTemplate>();
  @Output() edit = new EventEmitter<DaemonSetTemplate>();


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

  deleteDaemonsetTpl(template: DaemonSetTemplate) {
    this.delete.emit(template);
  }

  editDaemonsetTpl(template: DaemonSetTemplate){
    this.edit.emit(template);
  }
}
