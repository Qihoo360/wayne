import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { App } from '../../../shared/model/v1/app';
import { AppService } from '../../../shared/client/v1/app.service';
import { Secret } from '../../../shared/model/v1/secret';
import { SecretService } from '../../../shared/client/v1/secret.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-secret',
  templateUrl: 'create-edit-secret.component.html',
  styleUrls: ['create-edit-secret.scss']
})
export class CreateEditSecretComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  createSecretOpened: boolean;

  secretForm: NgForm;
  @ViewChild('secretForm', { static: true })
  currentForm: NgForm;

  @ViewChild(AceEditorBoxComponent, { static: false })
  aceBox: any;

  secret: Secret = new Secret();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  secretTitle: string;
  actionType: ActionType;
  apps: App[];

  constructor(
    private secretService: SecretService,
    private appService: AppService,
    private aceEditorService: AceEditorService,
    private messageHandlerService: MessageHandlerService
  ) {
  }

  ngOnInit(): void {
    this.appService
      .getNames()
      .subscribe(
        response => {
          this.apps = response.data;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  newOrEditSecret(id?: number) {
    this.createSecretOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.secretTitle = '编辑加密文件';
      this.secretService.getById(id, 0).subscribe(
        status => {
          this.secret = status.data;
          this.secret.metaDataObj = JSON.parse(this.secret.metaData ? this.secret.metaData : '{}');
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.secretTitle = '创建加密文件';
      this.secret = new Secret();
      this.secret.metaDataObj = {};
      this.initJsonEditor();
    }
  }

  initJsonEditor(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.secret.metaDataObj));
  }

  onCancel() {
    this.createSecretOpened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.secret.metaData = this.aceBox.getValue();
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.secretService.create(this.secret).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createSecretOpened = false;
            this.messageHandlerService.showSuccess('创建加密文件成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createSecretOpened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
      case ActionType.EDIT:
        this.secretService.update(this.secret).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createSecretOpened = false;
            this.messageHandlerService.showSuccess('更新加密文件成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createSecretOpened = false;
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
    const cont = this.currentForm.controls['secret_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }
}

