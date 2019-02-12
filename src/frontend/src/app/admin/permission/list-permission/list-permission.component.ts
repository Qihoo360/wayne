import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { Permission } from '../../../shared/model/v1/permission';
import { PermissionService } from '../../../shared/client/v1/permission.service';
import { Page } from '../../../shared/page/page-state';

@Component({
  selector: 'list-permission',
  templateUrl: 'list-permission.component.html'
})
export class ListPermissionComponent implements OnInit {

  @Input() permissions: Permission[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<Permission>();
  @Output() edit = new EventEmitter<Permission>();

  constructor(
    private permissionService: PermissionService,
    private messageHandlerService: MessageHandlerService,
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

  deletePermission(permission: Permission) {
    this.delete.emit(permission);
  }

  editPermission(permission: Permission) {
    this.edit.emit(permission);
  }
}
