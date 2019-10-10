import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType, groupType } from '../../../shared/shared.const';
import { NamespaceUser } from '../../../shared/model/v1/namespace-user';
import { Group } from '../../../shared/model/v1/group';
import { User } from '../../../shared/model/v1/user';
import { UserService } from '../../../shared/client/v1/user.service';
import { GroupService } from '../../../shared/client/v1/group.service';
import { NamespaceUserService } from '../../../shared/client/v1/namespace-user.service';
import { Namespace } from '../../../shared/model/v1/namespace';
import { PageState } from '../../../shared/page/page-state';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'create-edit-namespace-user',
  templateUrl: 'create-edit-namespace-user.component.html',
  styleUrls: ['create-edit-namespace-user.scss']
})
export class CreateEditNamespaceUserComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  createNamespaceUserOpened: boolean;

  namespaceUserForm: NgForm;
  @ViewChild('namespaceUserForm', { static: true })
  currentForm: NgForm;

  namespaceUser: NamespaceUser;
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;
  componentName = '命名空间用户';

  allGroups: Array<any>;
  mapGroups: Map<string, Group> = new Map<string, Group>();
  prepareGroups: Array<any>;
  selectGroups: Array<any>;

  namespaceUserTitle: string;
  actionType: ActionType;

  users: User[];

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private namespaceUserService: NamespaceUserService,
    private messageHandlerService: MessageHandlerService,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.namespaceUser = new NamespaceUser();
    this.namespaceUser.namespace = new Namespace();
    this.namespaceUser.user = new User();
    this.userService.getNames().subscribe(
      response => {
        this.users = response.data;
      },
      error => this.messageHandlerService.handleError(error)
    );
    this.groupService.listGroup(new PageState({pageSize: 500}), groupType[1].id).subscribe(
      response => {
        this.allGroups = response.data.list;
        for (const x in this.allGroups) {
          if (this.allGroups.hasOwnProperty(x)) {
            this.mapGroups.set(this.allGroups[x].id.toString(), this.allGroups[x]);
          }
        }
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  newOrEditNamespaceUser(namespaceId: string, id?: number) {
    this.prepareGroups = new Array<any>();
    this.createNamespaceUserOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.namespaceUserTitle = '编辑用户';
      this.namespaceUserService.getById(id, namespaceId).subscribe(
        status => {
          this.namespaceUser = status.data;
          // 编辑用户时，需要调整allGroup与selectGroup内容
          for (const key in this.allGroups) {
            if (this.allGroups.hasOwnProperty(key)) {
              for (const index in this.namespaceUser.groups) {
                if (this.namespaceUser.groups.hasOwnProperty(index)) {
                  const source = this.allGroups[key];
                  const detail = this.namespaceUser.groups[index];
                  if (JSON.stringify(source) === JSON.stringify(detail)) {
                    this.prepareGroups.push(this.allGroups[key].id.toString());
                  }
                }
              }
            }
          }
          this.selectGroups = this.prepareGroups;
          this.namespaceUser.user.name = this.getUserName(this.namespaceUser.user.id);
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.namespaceUserTitle = '添加用户';
      this.namespaceUser.namespace.id = Number(namespaceId);
      this.selectGroups = this.prepareGroups;
    }
  }

  onCancel() {
    this.createNamespaceUserOpened = false;
    this.currentForm.reset();
  }

  getUserName(id: number): string {
    const length = this.users.length;
    for (let i = 0; i < length; i++) {
      if (this.users[i].id === id) {
        return this.users[i].name;
      }
    }
    return '';
  }

  getUserId(name: string): number {
    const length = this.users.length;
    for (let i = 0; i < length; i++) {
      if (this.users[i].name === name) {
        return this.users[i].id;
      }
    }
    return 0;
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.namespaceUser.groups = new Array<Group>();
    this.isSubmitOnGoing = true;
    for (const k in this.selectGroups) {
      if (this.selectGroups.hasOwnProperty(k)) {
        this.namespaceUser.groups.push(this.mapGroups.get(this.selectGroups[k]));
      }
    }
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        // 处理user的id
        this.namespaceUser.user.id = this.getUserId(this.namespaceUser.user.name);
        if (this.namespaceUser.user.id === 0) {
          this.currentForm.reset();
          this.messageHandlerService.showError('该用户不存在！');
        } else {
          this.namespaceUserService.create(this.namespaceUser).subscribe(
            status => {
              this.isSubmitOnGoing = false;
              this.create.emit(true);
              this.createNamespaceUserOpened = false;
              this.messageHandlerService.showSuccess('创建' + this.componentName + '成功！');
            },
            error => {
              this.isSubmitOnGoing = false;
              this.createNamespaceUserOpened = false;
              this.messageHandlerService.handleError(error);
            }
          );
        }
        break;
      case ActionType.EDIT:
        this.namespaceUserService.update(this.namespaceUser).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createNamespaceUserOpened = false;
            this.messageHandlerService.showSuccess('更新' + this.componentName + '成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createNamespaceUserOpened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
    }
    this.currentForm.reset();
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
    if (this.getUserId(this.namespaceUser.user.name) === 0) {
      this.isNameValid = false;
    } else {
      this.isNameValid = true;
    }
  }
}

