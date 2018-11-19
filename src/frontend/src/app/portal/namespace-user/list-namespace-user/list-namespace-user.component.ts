import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {State} from '@clr/angular';
import {NamespaceUser} from '../../../shared/model/v1/namespace-user';
import {AuthService} from '../../../shared/auth/auth.service';
import {Page} from '../../../shared/page/page-state';

@Component({
  selector: 'list-namespace-user',
  templateUrl: 'list-namespace-user.component.html',
  styleUrls: ['list-namespace-user.scss']
})
export class ListNamespaceUserComponent implements OnInit {
  @Input() showState: object;
  @Input() listType: string;
  @Input() namespaceUsers: NamespaceUser[];
  @Input() page: Page;
  currentPage: number = 1;
  state: State;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<NamespaceUser>();
  @Output() edit = new EventEmitter<NamespaceUser>();

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
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

  deleteNamespaceUser(namespaceUser: NamespaceUser) {
    this.delete.emit(namespaceUser);
  }

  editNamespaceUser(namespaceUser: NamespaceUser) {
    this.edit.emit(namespaceUser);
  }
}
