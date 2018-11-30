import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { PersistentVolumeClaimTpl } from '../../../shared/model/v1/persistentvolumeclaimtpl';
import { Page } from '../../../shared/page/page-state';

@Component({
  selector: 'list-persistentvolumeclaimtpl',
  templateUrl: 'list-persistentvolumeclaimtpl.component.html'
})

export class ListPersistentVolumeClaimTplComponent implements OnInit {

  @Input() pvcTpls: PersistentVolumeClaimTpl[];

  @Input() page: Page;
  currentPage: number = 1;
  state: State;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<PersistentVolumeClaimTpl>();
  @Output() edit = new EventEmitter<PersistentVolumeClaimTpl>();


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

  deletePvcTpl(tpl: PersistentVolumeClaimTpl) {
    this.delete.emit(tpl);
  }

  editPvcTpl(tpl: PersistentVolumeClaimTpl) {
    this.edit.emit(tpl);
  }
}
