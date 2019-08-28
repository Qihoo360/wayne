import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType, ApiKeyType } from '../../../shared/shared.const';
import { ApiKey } from 'app/shared/model/v1/apikey';
import { ApiKeyService } from '../../../shared/client/v1/apikey.service';
import { GroupService } from '../../../shared/client/v1/group.service';
import { Group } from '../../../shared/model/v1/group';
import { PageState } from '../../../shared/page/page-state';

@Component({
  selector: 'create-edit-apikey',
  templateUrl: 'create-edit-apikey.component.html',
  styleUrls: ['create-edit-apikey.scss']
})
export class CreateEditApiKeyComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  apiKeyForm: NgForm;
  @ViewChild('apiKeyForm', { static: true })
  currentForm: NgForm;

  apiKey = new ApiKey();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  groups = Array<Group>();
  title: string;
  actionType: ActionType;
  apiKeyTypes = Array<any>();

  constructor(private messageHandlerService: MessageHandlerService,
              private apiKeyService: ApiKeyService,
              private groupService: GroupService) {
  }

  ngOnInit(): void {
    this.apiKeyTypes = ApiKeyType;
    this.groupService.listGroup(new PageState({pageSize: 1000}), 2).subscribe(
      response => {
        const data = response.data;
        this.groups = data.list;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  newOrEdit(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑APIKey';
      this.apiKeyService.getById(id, null, 0).subscribe(
        status => {
          this.apiKey = status.data;
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建APIKey';
      this.apiKey = new ApiKey();
    }
  }

  onCancel() {
    this.modalOpened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.apiKeyService.create(this.apiKey, null, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建APIKey成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.apiKeyService.update(this.apiKey, null, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新APIKey成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
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
      !this.checkOnGoing;
  }

}

