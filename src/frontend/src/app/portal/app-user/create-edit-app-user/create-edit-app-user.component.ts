import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType, groupType } from '../../../shared/shared.const';
import { AppUser } from '../../../shared/model/v1/app-user';
import { Group } from '../../../shared/model/v1/group';
import { User } from '../../../shared/model/v1/user';
import { UserService } from '../../../shared/client/v1/user.service';
import { GroupService } from '../../../shared/client/v1/group.service';
import { AppUserService } from '../../../shared/client/v1/app-user.service';
import { App } from '../../../shared/model/v1/app';
import { PageState } from '../../../shared/page/page-state';

@Component({
  selector: 'create-edit-app-user',
  templateUrl: 'create-edit-app-user.component.html',
  styleUrls: ['create-edit-app-user.scss']
})
export class CreateEditAppUserComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  createAppUserOpened: boolean;

  appUserForm: NgForm;
  @ViewChild('appUserForm', { static: true })
  currentForm: NgForm;

  appUser: AppUser;
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  allGroups: Array<any>;
  mapGroups: Map<string, Group> = new Map<string, Group>();
  prepareGroups: Array<any>;
  selectGroups: Array<any>;

  appUserTitle: string;
  actionType: ActionType;

  users: User[];

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private appUserService: AppUserService,
    private messageHandlerService: MessageHandlerService
  ) {
  }

  ngOnInit(): void {
    this.appUser = new AppUser();
    this.appUser.app = new App();
    this.appUser.user = new User();
    this.userService.getNames().subscribe(
      response => {
        this.users = response.data;
      },
      error => this.messageHandlerService.handleError(error)
    );
    this.groupService.listGroup(new PageState({pageSize: 500}), groupType[0].id).subscribe(
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

  newOrEditAppUser(appId: string, id?: number) {
    this.prepareGroups = new Array<any>();
    this.createAppUserOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.appUserTitle = '编辑项目用户';
      this.appUserService.getById(id, parseInt(appId, 10)).subscribe(
        status => {
          this.appUser = status.data;
          // 编辑用户时，需要调整allGroup与selectGroup内容
          for (const key in this.allGroups) {
            if (this.allGroups.hasOwnProperty(key)) {
              for (const index in this.appUser.groups) {
                if (this.appUser.groups.hasOwnProperty(index)) {
                  const source = this.allGroups[key];
                  const detail = this.appUser.groups[index];
                  if (JSON.stringify(source) === JSON.stringify(detail)) {
                    this.prepareGroups.push(this.allGroups[key].id.toString());
                  }
                }
              }
            }
          }
          this.selectGroups = this.prepareGroups;
          this.appUser.user.name = this.getUserName(this.appUser.user.id);
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.appUserTitle = '创建项目用户';
      this.appUser.app.id = Number(appId);
      this.selectGroups = this.prepareGroups;
    }
  }

  onCancel() {
    this.createAppUserOpened = false;
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
    this.appUser.groups = new Array<Group>();
    this.isSubmitOnGoing = true;
    for (const k in this.selectGroups) {
      if (this.selectGroups.hasOwnProperty(k)) {
        this.appUser.groups.push(this.mapGroups.get(this.selectGroups[k]));
      }
    }
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        // 处理user的id
        this.appUser.user.id = this.getUserId(this.appUser.user.name);
        if (this.appUser.user.id === 0) {
          this.currentForm.reset();
          this.messageHandlerService.showError('该用户不存在！');
        } else {
          this.appUserService.create(this.appUser).subscribe(
            status => {
              this.isSubmitOnGoing = false;
              this.create.emit(true);
              this.createAppUserOpened = false;
              this.messageHandlerService.showSuccess('创建项目用户成功！');
            },
            error => {
              this.isSubmitOnGoing = false;
              this.createAppUserOpened = false;
              this.messageHandlerService.handleError(error);
            }
          );
        }
        break;
      case ActionType.EDIT:
        this.appUserService.update(this.appUser).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createAppUserOpened = false;
            this.messageHandlerService.showSuccess('更新项目用户成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createAppUserOpened = false;
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
    if (this.getUserId(this.appUser.user.name) === 0) {
      this.isNameValid = false;
    } else {
      this.isNameValid = true;
    }
  }
}


