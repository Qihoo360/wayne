import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { AppUser } from 'wayne-component/lib/model/v1/app-user';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { Page } from 'wayne-component/lib/page/page-state';

@Component({
  selector: 'list-app-user',
  templateUrl: 'list-app-user.component.html',
  styleUrls: ['list-app-user.scss']
})
export class ListAppUserComponent implements OnInit {
  @Input() showState: object;
  @Input() listType: string;
  @Input() appUsers: AppUser[];
  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<AppUser>();
  @Output() edit = new EventEmitter<AppUser>();

  constructor(
    public authService: AuthService,
    private router: Router
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

  refresh(state: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteAppUser(appUser: AppUser) {
    this.delete.emit(appUser);
  }

  editAppUser(appUser: AppUser) {
    this.edit.emit(appUser);
  }
}
