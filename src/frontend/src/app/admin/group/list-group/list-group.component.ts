import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { Group } from '../../../shared/model/v1/group';
import { GroupService } from '../../../shared/client/v1/group.service';
import { groupType } from '../../../shared/shared.const';
import { Page } from '../../../shared/page/page-state';

@Component({
  selector: 'list-group',
  templateUrl: 'list-group.component.html'
})
export class ListGroupComponent implements OnInit {

  @Input() groups: Group[];

  @Input() page: Page;
  currentPage: number = 1;
  state: State;

  @Output() paginate = new EventEmitter<State>();
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

  refresh(state: State) {
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
