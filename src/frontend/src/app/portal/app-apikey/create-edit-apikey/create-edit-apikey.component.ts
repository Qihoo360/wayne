import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType, apiKeyTypeApp } from '../../../shared/shared.const';
import { ApiKey } from 'app/shared/model/v1/apikey';
import { ApiKeyService } from '../../../shared/client/v1/apikey.service';
import { GroupService } from '../../../shared/client/v1/group.service';
import { Group } from '../../../shared/model/v1/group';
import { ActivatedRoute } from '@angular/router';
import { PageState } from '../../../shared/page/page-state';
import { TranslateService } from '@ngx-translate/core';

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

  appId: number;

  constructor(private messageHandlerService: MessageHandlerService,
              private route: ActivatedRoute,
              private apiKeyService: ApiKeyService,
              public translate: TranslateService,
              private groupService: GroupService) {
  }

  ngOnInit(): void {
    this.appId = parseInt(this.route.parent.snapshot.params['id'], 10);

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
      this.title = 'ACTION.EDIT';
      this.apiKeyService.getById(id, null, this.appId).subscribe(
        status => {
          this.apiKey = status.data;
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = 'ACTION.CREATE';
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
    this.apiKey.type = apiKeyTypeApp;
    this.apiKey.resourceId = this.appId;
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.apiKeyService.create(this.apiKey, null, this.appId).subscribe(
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
    }
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      !this.checkOnGoing;
  }

}

