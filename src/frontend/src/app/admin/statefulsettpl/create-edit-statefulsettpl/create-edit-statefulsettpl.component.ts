import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from 'wayne-component';
import { ActionType } from 'wayne-component/lib/shared.const';
import { isUndefined } from 'util';
import { StatefulsetTemplate } from 'wayne-component/lib/model/v1/statefulsettpl';
import { Statefulset } from 'wayne-component/lib/model/v1/statefulset';
import { StatefulsetTplService } from 'wayne-component/lib/client/v1/statefulsettpl.service';
import { StatefulsetService } from 'wayne-component/lib/client/v1/statefulset.service';
import { AceEditorBoxComponent } from 'wayne-component/lib/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-statefulsettpl',
  templateUrl: 'create-edit-statefulsettpl.component.html',
  styleUrls: ['create-edit-statefulsettpl.scss']
})
export class CreateEditStatefulsettplComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;

  statefulsetTpl: StatefulsetTemplate = new StatefulsetTemplate();
  isSubmitOnGoing = false;

  title: string;
  actionType: ActionType;

  statefulsets: Statefulset[];

  @ViewChild(AceEditorBoxComponent) aceBox: any;

  constructor(private statefulsetTplService: StatefulsetTplService,
              private statefulsetService: StatefulsetService,
              private messageHandlerService: MessageHandlerService,
              private aceEditorService: AceEditorService) {
  }

  ngOnInit(): void {
    this.statefulsetService
      .getNames()
      .subscribe(
        response => {
          this.statefulsets = response.data;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  initJsonEditor(): void {
    let json = {};
    if (this.statefulsetTpl && this.statefulsetTpl.template) {
      json = JSON.parse(this.statefulsetTpl.template);
    }
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(json));
  }

  newOrEdit(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑状态副本集模版';
      this.statefulsetTplService.getById(id, 0).subscribe(
        status => {
          this.statefulsetTpl = status.data;
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建状态副本集模版';
      this.statefulsetTpl = new StatefulsetTemplate();
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
    this.statefulsetTpl.template = this.aceBox.getValue();
    for (const statefulset of this.statefulsets) {
      if (statefulset.id === this.statefulsetTpl.statefulsetId) {
        this.statefulsetTpl.name = statefulset.name;
      }
    }
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.statefulsetTplService.create(this.statefulsetTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建状态副本集模版成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.statefulsetTplService.update(this.statefulsetTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新状态副本集模版成功！');
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
      !isUndefined(this.statefulsetTpl.statefulsetId);
  }


}

