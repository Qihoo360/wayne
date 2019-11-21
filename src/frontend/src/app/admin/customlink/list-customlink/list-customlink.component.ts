import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../../shared/page/page-state';
import { Customlink } from 'app/shared/model/v1/customlink';

@Component({
  selector: 'list-customlink',
  templateUrl: 'list-customlink.component.html'
})
export class ListCustomlinkComponent implements OnInit {

  @Input() configs: Customlink[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<Customlink>();
  @Output() edit = new EventEmitter<Customlink>();
  @Output() update = new EventEmitter<Customlink> ();

  constructor() {
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


  deleteConfig(config: Customlink) {
    this.delete.emit(config);
  }

  editConfig(config: Customlink) {
    this.edit.emit(config);
  }

  updateConfig(config: Customlink) {
    this.update.emit(config);
  }
}
