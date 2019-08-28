import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { WebHook } from '../../../shared/model/v1/webhook';
import { WebHookService } from '../../../shared/client/v1/webhook.service';
import { HookEvent } from '../../../shared/model/v1/hook-event';
import { CacheService } from '../../../shared/auth/cache.service';

@Component({
  selector: 'create-edit-app-webhook',
  templateUrl: 'create-edit-app-webhook.component.html',
  styleUrls: ['create-edit-app-webhook.scss']
})
export class CreateEditAppWebHookComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  @Output() update = new EventEmitter<boolean>();

  @ViewChild('webHookForm', { static: true })
  currentForm: NgForm;

  webHook: WebHook;
  modalOpened = false;
  requestLocked = false;

  hookEvents: Array<HookEvent>;
  watchEventKeys: Array<string>;

  webHookTitle: string;
  actionType: ActionType;
  resourceLabel = 'WebHook';

  constructor(
    private webHookService: WebHookService,
    private contextService: CacheService,
    private messageHandlerService: MessageHandlerService
  ) {
  }

  ngOnInit(): void {
    this.webHook = new WebHook();

    this.webHookService.getEvents().subscribe(
      response => {
        this.hookEvents = response.data;
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  createEditWebHook(webhook?: WebHook) {
    if (webhook) {
      this.actionType = ActionType.EDIT;
      this.webHookTitle = '编辑' + this.resourceLabel;
      this.webHookService.get(1, this.contextService.appId, webhook.id).subscribe(
        next => {
          this.webHook = next.data;
          this.watchEventKeys = this.webHook.events.split(',');
          this.modalOpened = true;
        },
        error => {
          this.messageHandlerService.handleError(error);
        }
      );
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.webHookTitle = '创建' + this.resourceLabel;
      this.webHook = new WebHook();
      this.watchEventKeys = [];
      this.modalOpened = true;
    }
  }

  onCancel() {
    this.modalOpened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.requestLocked) {
      return;
    }
    if ((this.watchEventKeys || []).length === 0) {
      this.messageHandlerService.showError('至少关注一个事件');
      return;
    }
    this.webHook.events = (this.watchEventKeys || []).join(',');
    this.webHook.scope = 1;
    this.webHook.objectId = this.contextService.appId;

    this.requestLocked = true;
    if (this.webHook.id === undefined) {
      this.webHookService.create(this.webHook).subscribe(
        next => {
          this.requestLocked = false;
          this.create.emit(true);
          this.modalOpened = false;
          this.messageHandlerService.showSuccess('创建' + this.resourceLabel + '成功！');
        },
        error => {
          this.requestLocked = false;
          this.modalOpened = false;
          this.messageHandlerService.handleError(error);
        },
        () => {
          this.currentForm.reset();
        }
      );
    } else {
      this.webHookService.update(this.webHook).subscribe(
        next => {
          this.requestLocked = false;
          this.update.emit(true);
          this.modalOpened = false;
          this.messageHandlerService.showSuccess('更新' + this.resourceLabel + '成功！');
        },
        error => {
          this.requestLocked = false;
          this.modalOpened = false;
          this.messageHandlerService.handleError(error);
        },
        () => {
          this.currentForm.reset();
        }
      );
    }
  }

  public get isValid(): boolean {
    return this.currentForm && this.currentForm.valid;
  }
}
