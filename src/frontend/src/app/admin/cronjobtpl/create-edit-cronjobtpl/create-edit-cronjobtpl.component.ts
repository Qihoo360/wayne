import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { isUndefined } from 'util';
import { CronjobTpl } from '../../../shared/model/v1/cronjobtpl';
import { Cronjob } from '../../../shared/model/v1/cronjob';
import { CronjobTplService } from '../../../shared/client/v1/cronjobtpl.service';
import { CronjobService } from '../../../shared/client/v1/cronjob.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-cronjobtpl',
  templateUrl: 'create-edit-cronjobtpl.component.html',
  styleUrls: ['create-edit-cronjobtpl.scss']
})
export class CreateEditCronjobTplComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;

  cronjobTpl: CronjobTpl = new CronjobTpl();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  componentName = '计划任务';

  title: string;
  actionType: ActionType;

  cronjobs: Cronjob[];

  @ViewChild(AceEditorBoxComponent, { static: false }) aceBox: any;

  constructor(private cronjobTplService: CronjobTplService,
              private cronjobService: CronjobService,
              private messageHandlerService: MessageHandlerService,
              private aceEditorService: AceEditorService) {
  }

  ngOnInit(): void {
    this.cronjobService
      .getNames()
      .subscribe(
        response => {
          this.cronjobs = response.data;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  initJsonEditor(): void {
    let json = {};
    if (this.cronjobTpl && this.cronjobTpl.template) {
      json = JSON.parse(this.cronjobTpl.template);
    }
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(json));
  }

  newOrEditCronjobTpl(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑' + this.componentName;
      this.cronjobTplService.getById(id, 0).subscribe(
        status => {
          this.cronjobTpl = status.data;
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建' + this.componentName;
      this.cronjobTpl = new CronjobTpl();
      this.initJsonEditor();
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
    if (!this.aceBox.isValid) {
      alert('语法有误，请检查！');
      this.isSubmitOnGoing = false;
      return;
    }
    for (const cronjob of this.cronjobs) {
      if (cronjob.id === this.cronjobTpl.cronjobId) {
        this.cronjobTpl.name = cronjob.name;
      }
    }
    this.cronjobTpl.template = this.aceBox.getValue();
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.cronjobTplService.create(this.cronjobTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建' + this.componentName + '成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.cronjobTplService.update(this.cronjobTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新' + this.componentName + '成功！');
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
      !this.checkOnGoing &&
      !isUndefined(this.cronjobTpl.cronjobId);
  }
}

