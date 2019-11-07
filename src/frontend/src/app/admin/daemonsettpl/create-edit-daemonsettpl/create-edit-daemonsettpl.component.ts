import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { isUndefined } from 'util';
import { DaemonSetTemplate } from '../../../shared/model/v1/daemonsettpl';
import { DaemonSet } from '../../../shared/model/v1/daemonset';
import { DaemonSetTplService } from '../../../shared/client/v1/daemonsettpl.service';
import { DaemonSetService } from '../../../shared/client/v1/daemonset.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-daemonsettpl',
  templateUrl: 'create-edit-daemonsettpl.component.html',
  styleUrls: ['create-edit-daemonsettpl.scss']
})
export class CreateEditDaemonsettplComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;

  daemonsetTpl: DaemonSetTemplate = new DaemonSetTemplate();
  isSubmitOnGoing = false;

  title: string;
  actionType: ActionType;

  daemonsets: DaemonSet[];

  @ViewChild(AceEditorBoxComponent, { static: false }) aceBox: any;

  constructor(private daemonsetTplService: DaemonSetTplService,
              private daemonsetService: DaemonSetService,
              private messageHandlerService: MessageHandlerService,
              private aceEditorService: AceEditorService) {
  }

  ngOnInit(): void {
    this.daemonsetService.getNames()
      .subscribe(
        response => {
          this.daemonsets = response.data;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  initJsonEditor(): void {
    let json = {};
    if (this.daemonsetTpl && this.daemonsetTpl.template) {
      json = JSON.parse(this.daemonsetTpl.template);
    }
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(json));
  }

  newOrEdit(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑守护进程集模版';
      this.daemonsetTplService.getById(id, 0).subscribe(
        status => {
          this.daemonsetTpl = status.data;
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建守护进程集模版';
      this.daemonsetTpl = new DaemonSetTemplate();
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
    this.daemonsetTpl.template = this.aceBox.getValue();
    for (const daemonset of this.daemonsets) {
      if (daemonset.id === this.daemonsetTpl.daemonSetId) {
        this.daemonsetTpl.name = daemonset.name;
      }
    }
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.daemonsetTplService.create(this.daemonsetTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建守护进程集模版成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.daemonsetTplService.update(this.daemonsetTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新守护进程集模版成功！');
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
      !isUndefined(this.daemonsetTpl.daemonSetId);
  }


}

