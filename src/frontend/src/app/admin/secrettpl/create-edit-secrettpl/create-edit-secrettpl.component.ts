import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { SecretTpl } from '../../../shared/model/v1/secrettpl';
import { Secret } from '../../../shared/model/v1/secret';
import { SecretTplService } from '../../../shared/client/v1/secrettpl.service';
import { SecretService } from '../../../shared/client/v1/secret.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-secrettpl',
  templateUrl: 'create-edit-secrettpl.component.html',
  styleUrls: ['create-edit-secrettpl.scss']
})
export class CreateEditSecretTplComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  createSecrettplOpened: boolean;

  secrettplForm: NgForm;
  @ViewChild('secrettplForm', { static: true })
  currentForm: NgForm;

  secrettpl: SecretTpl = new SecretTpl();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  secrettplTitle: string;
  actionType: ActionType;
  secrets: Secret[];

  @ViewChild(AceEditorBoxComponent, { static: false }) aceBox: any;

  constructor(
    private secrettplService: SecretTplService,
    private secretService: SecretService,
    private messageHandlerService: MessageHandlerService,
    private aceEditorService: AceEditorService
  ) {
  }

  ngOnInit(): void {
    this.secretService.getNames().subscribe(
      response => {
        this.secrets = response.data;
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  initJsonEditor(): void {
    let json = {};
    if (this.secrettpl && this.secrettpl.template) {
      json = JSON.parse(this.secrettpl.template);
    }
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(json));
  }

  newOrEditSecrettpl(id?: number) {
    this.createSecrettplOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.secrettplTitle = '编辑加密文件模板';
      this.secrettplService.getById(id, 0).subscribe(
        status => {
          this.secrettpl = status.data;
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.secrettplTitle = '创建加密文件模板';
      this.secrettpl = new SecretTpl();
      this.initJsonEditor();
    }
  }

  onCancel() {
    this.createSecrettplOpened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    if (!this.aceBox.isValid) {
      alert('语法有误，请检查！');
      this.isSubmitOnGoing = false;
      return;
    }
    this.secrettpl.template = this.aceBox.getValue();
    for (const secret of this.secrets) {
      if (secret.id === this.secrettpl.secretId) {
        this.secrettpl.name = secret.name;
      }
    }
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.secrettplService.create(this.secrettpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createSecrettplOpened = false;
            this.messageHandlerService.showSuccess('创建加密文件模板成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createSecrettplOpened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
      case ActionType.EDIT:
        this.secrettplService.update(this.secrettpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createSecrettplOpened = false;
            this.messageHandlerService.showSuccess('更新加密文件模板成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createSecrettplOpened = false;
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
    const cont = this.currentForm.controls['secrettpl_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }
}

