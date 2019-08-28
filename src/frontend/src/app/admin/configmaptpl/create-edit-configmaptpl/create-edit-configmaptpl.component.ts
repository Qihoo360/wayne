import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { isUndefined } from 'util';
import { ConfigMapTpl } from '../../../shared/model/v1/configmaptpl';
import { ConfigMap } from '../../../shared/model/v1/configmap';
import { ConfigMapTplService } from '../../../shared/client/v1/configmaptpl.service';
import { ConfigMapService } from '../../../shared/client/v1/configmap.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-configmaptpl',
  templateUrl: 'create-edit-configmaptpl.component.html',
  styleUrls: ['create-edit-configmaptpl.scss']
})
export class CreateEditConfigMapTplComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;
  ngForm: NgForm;
  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;

  configMapTpl: ConfigMapTpl = new ConfigMapTpl();
  checkOnGoing = false;
  isSubmitOnGoing = false;

  title: string;
  actionType: ActionType;

  configMaps: ConfigMap[];

  @ViewChild(AceEditorBoxComponent, { static: false }) aceBox: any;

  constructor(private configMapTplService: ConfigMapTplService,
              private configMapService: ConfigMapService,
              private messageHandlerService: MessageHandlerService,
              private aceEditorService: AceEditorService) {
  }

  ngOnInit(): void {
    this.configMapService
      .getNames()
      .subscribe(
        response => {
          this.configMaps = response.data;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  initJsonEditor(): void {
    let json = {};
    if (this.configMapTpl.template) {
      json = JSON.parse(this.configMapTpl.template);
    }
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(json));
  }

  newOrEditConfigMapTpl(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑配置集模版';
      this.configMapTplService.getById(id, 0).subscribe(
        status => {
          this.configMapTpl = status.data;
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建配置集模版';
      this.configMapTpl = new ConfigMapTpl();
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
    for (const configMap of this.configMaps) {
      if (configMap.id === this.configMapTpl.configMapId) {
        this.configMapTpl.name = configMap.name;
      }
    }
    this.configMapTpl.template = this.aceBox.getValue();
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.configMapTplService.create(this.configMapTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建配置集模版成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.configMapTplService.update(this.configMapTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新配置集模版成功！');
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
      !isUndefined(this.configMapTpl.configMapId);
  }
}

