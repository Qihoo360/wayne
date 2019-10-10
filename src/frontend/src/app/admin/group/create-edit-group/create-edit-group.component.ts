import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType, groupType } from '../../../shared/shared.const';
import { Group } from '../../../shared/model/v1/group';
import { Permission } from '../../../shared/model/v1/permission';
import { GroupService } from '../../../shared/client/v1/group.service';
import { PermissionService } from '../../../shared/client/v1/permission.service';
import { PageState } from '../../../shared/page/page-state';

@Component({
  selector: 'create-edit-group',
  templateUrl: 'create-edit-group.component.html',
  styleUrls: ['create-edit-group.scss']
})
export class CreateEditGroupComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  createGroupOpened: boolean;

  groupForm: NgForm;
  @ViewChild('groupForm', { static: true })
  currentForm: NgForm;

  group: Group = new Group();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  groupTitle: string;
  actionType: ActionType;

  basePermissions: Array<any>;
  allPermissions: Array<any>;
  mapPermissions: Map<string, Permission> = new Map<string, Permission>();
  preparePermissions: Array<any>;
  selectPermissions: Array<any>;
  groupType: Array<any>;

  constructor(
    private groupService: GroupService,
    private permissionService: PermissionService,
    private messageHandlerService: MessageHandlerService
  ) {
  }

  ngOnInit(): void {
    this.groupType = groupType;
    this.permissionService.listPermission(new PageState({pageSize: 500})).subscribe(
      response => {
        this.basePermissions = response.data.list;
        for (const x in this.basePermissions) {
          if (this.basePermissions.hasOwnProperty(x)) {
            this.mapPermissions.set(this.basePermissions[x].id.toString(), this.basePermissions[x]);
          }
        }
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  newOrEditGroup(id?: number) {
    this.allPermissions = this.basePermissions;
    this.preparePermissions = new Array<any>();
    this.createGroupOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.groupTitle = '编辑角色';
      this.groupService.getGroup(id).subscribe(
        status => {
          this.group = status.data;
          for (const key in this.allPermissions) {
            if (this.allPermissions.hasOwnProperty(key)) {
              for (const index in this.group.permissions) {
                if (this.group.permissions.hasOwnProperty(index)) {
                  const source = this.allPermissions[key];
                  const detail = this.group.permissions[index];
                  if (JSON.stringify(source) === JSON.stringify(detail)) {
                    this.preparePermissions.push(this.allPermissions[key].id.toString());
                  }
                }
              }
            }
          }
          this.selectPermissions = this.preparePermissions;
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.groupTitle = '创建角色';
      this.group = new Group();
      this.selectPermissions = this.preparePermissions;
    }
  }

  onCancel() {
    this.createGroupOpened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.group.permissions = new Array<Permission>();
    this.isSubmitOnGoing = true;
    for (const k in this.selectPermissions) {
      if (this.selectPermissions.hasOwnProperty(k)) {
        this.group.permissions.push(this.mapPermissions.get(this.selectPermissions[k]));
      }
    }

    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.groupService.createGroup(this.group).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createGroupOpened = false;
            this.messageHandlerService.showSuccess('创建角色成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createGroupOpened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
      case ActionType.EDIT:
        this.groupService.updateGroup(this.group).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createGroupOpened = false;
            this.messageHandlerService.showSuccess('更新角色成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createGroupOpened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
    }
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing;
  }

  // Handle the form validation
  handleValidation(): void {
    const cont = this.currentForm.controls['group_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }
}

