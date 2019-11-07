import { EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { ActionType } from '../../shared.const';
import { AceEditorBoxComponent } from '../../ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../ace-editor/ace-editor';

export class CreateEditResourceTemplateComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;

  // template: any = new IngressTpl();
  checkOnGoing = false;
  isSubmitOnGoing = false;

  title: string;
  actionType: ActionType;

  resources: any[];

  @ViewChild(AceEditorBoxComponent, { static: false }) aceBox: any;
  constructor(public resourceTemplateService: any,
              public resourceService: any,
              public messageHandlerService: MessageHandlerService,
              public aceEditorService: AceEditorService,
              public template: any,
              public componentName: string,
              public defaultResourceTemplate: string) {
  }

  ngOnInit(): void {
    this.resourceService.getNames().subscribe(
      response => {
        this.resources = response.data;
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  initJsonEditor(): void {
    let json = {};
    if (this.template && this.template.template) {
      json = JSON.parse(this.template.template);
    }
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(json));
  }

  newOrEditResourceTemplate(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = `编辑 ${this.componentName}`;
      this.resourceTemplateService.getById(id, 0).subscribe(
        status => {
          this.template = status.data;
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = `编辑 ${this.componentName}`;
      this.template = {};
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
    this.template.template = this.aceBox.getValue();
    for (const resource of this.resources) {
      if (resource.id === this.template.ingressId) {
        this.template.name = resource.name;
      }
    }
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.resourceTemplateService.create(this.template, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess(`创建 ${this.componentName}成功！`);
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.resourceTemplateService.update(this.template, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess(`更新 ${this.componentName}成功！`);
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
