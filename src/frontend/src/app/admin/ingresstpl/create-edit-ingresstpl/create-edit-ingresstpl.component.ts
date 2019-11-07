import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { isUndefined } from 'util';
import { IngressTpl } from '../../../shared/model/v1/ingresstpl';
import { Ingress } from '../../../shared/model/v1/ingress';
import { IngressTplService } from '../../../shared/client/v1/ingresstpl.service';
import { IngressService } from '../../../shared/client/v1/ingress.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-ingresstpl',
  templateUrl: 'create-edit-ingresstpl.component.html',
  styleUrls: ['create-edit-ingresstpl.scss']
})
export class CreateEditIngressTplComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;

  ingressTpl: IngressTpl = new IngressTpl();
  checkOnGoing = false;
  isSubmitOnGoing = false;

  title: string;
  actionType: ActionType;

  ingresses: Ingress[];

  @ViewChild(AceEditorBoxComponent, { static: false }) aceBox: any;
  constructor(private ingressTplService: IngressTplService,
              private ingressService: IngressService,
              private messageHandlerService: MessageHandlerService,
              private aceEditorService: AceEditorService) {
  }

  ngOnInit(): void {
    this.ingressService.getNames().subscribe(
      response => {
        this.ingresses = response.data;
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  initJsonEditor(): void {
    let json = {};
    if (this.ingressTpl && this.ingressTpl.template) {
      json = JSON.parse(this.ingressTpl.template);
    }
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(json));
  }

  newOrEditServiceTpl(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑 Ingress 模版';
      this.ingressTplService.getById(id, 0).subscribe(
        status => {
          this.ingressTpl = status.data;
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建 Ingress 模版';
      this.ingressTpl = new IngressTpl();
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
    this.ingressTpl.template = this.aceBox.getValue();
    for (const ingress of this.ingresses) {
      if (ingress.id === this.ingressTpl.ingressId) {
        this.ingressTpl.name = ingress.name;
      }
    }
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.ingressTplService.create(this.ingressTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建 Ingress 模版成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.ingressTplService.update(this.ingressTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新 Ingress 模版成功！');
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
      !isUndefined(this.ingressTpl.ingressId);
  }


}

