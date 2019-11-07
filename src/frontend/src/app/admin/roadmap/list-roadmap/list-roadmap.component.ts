import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../../shared/page/page-state';
import { LinkType } from '../../../shared/model/v1/link-type';

@Component({
  selector: 'list-roadmap',
  templateUrl: './list-roadmap.component.html',
  styleUrls: ['./list-roadmap.component.scss']
})
export class ListRoadmapComponent implements OnInit {
  @Input() configs: LinkType[];
  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<LinkType>();
  @Output() edit = new EventEmitter<LinkType>();

  constructor() { }

  ngOnInit() {
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

  deleteConfig(config: LinkType) {
    this.delete.emit(config);
  }

  editConfig(config: LinkType) {
    this.edit.emit(config);
  }
}
