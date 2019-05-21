import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from 'wayne-component';
import { Group } from 'wayne-component/lib/model/v1/group';
import { GroupService } from 'wayne-component/lib/client/v1/group.service';
import { groupType } from 'wayne-component/lib/shared.const';
import { Page } from 'wayne-component/lib/page/page-state';

@Component({
  selector: 'list-group',
  templateUrl: 'list-group.component.html'
})
export class ListGroupComponent implements OnInit {

  @Input() groups: Group[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<Group>();
  @Output() edit = new EventEmitter<Group>();

  groupType: Array<any>;

  constructor(
    private groupService: GroupService,
    private messageHandlerService: MessageHandlerService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.groupType = groupType;
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

  deleteGroup(group: Group) {
    this.delete.emit(group);
  }

  editGroup(group: Group) {
    this.edit.emit(group);
  }
}
