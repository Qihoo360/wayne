import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../../shared/page/page-state';
import { Config } from '../../../shared/model/v1/config';

@Component({
  selector: 'list-customlink',
  templateUrl: 'list-customlink.component.html'
})
export class ListCustomlinkComponent implements OnInit {

  @Input() configs: Config[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<Config>();
  @Output() edit = new EventEmitter<Config>();
  @Output() update = new EventEmitter<Config> ();

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


  deleteConfig(config: Config) {
    this.delete.emit(config);
  }

  editConfig(config: Config) {
    this.edit.emit(config);
  }

  updateConfig(config: Config) {
    this.update.emit(config);
  }
}
