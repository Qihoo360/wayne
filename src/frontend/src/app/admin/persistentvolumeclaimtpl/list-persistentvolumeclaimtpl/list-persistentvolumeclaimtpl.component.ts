import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { PersistentVolumeClaimTpl } from '../../../shared/model/v1/persistentvolumeclaimtpl';
import { Page } from '../../../shared/page/page-state';

@Component({
  selector: 'list-persistentvolumeclaimtpl',
  templateUrl: 'list-persistentvolumeclaimtpl.component.html'
})

export class ListPersistentVolumeClaimTplComponent implements OnInit {

  @Input() pvcTpls: PersistentVolumeClaimTpl[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
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

  refresh(state: ClrDatagridStateInterface) {
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
