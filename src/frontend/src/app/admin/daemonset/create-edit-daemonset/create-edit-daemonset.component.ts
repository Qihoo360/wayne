import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { isUndefined } from 'util';
import { App } from '../../../shared/model/v1/app';
import { AppService } from '../../../shared/client/v1/app.service';
import { DaemonSet } from '../../../shared/model/v1/daemonset';
import { DaemonSetService } from '../../../shared/client/v1/daemonset.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-daemonset',
  templateUrl: 'create-edit-daemonset.component.html',
  styleUrls: ['create-edit-daemonset.scss']
})
export class CreateEditDaemonsetComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;

  @ViewChild(AceEditorBoxComponent, { static: false })
  aceBox: any;

  daemonset: DaemonSet = new DaemonSet();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  title: string;
  resourceName = '守护进程集';
  actionType: ActionType;

  apps: App[];

  constructor(private daemonsetService: DaemonSetService,
              private appService: AppService,
              private aceEditorService: AceEditorService,
              private messageHandlerService: MessageHandlerService) {
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

  newOrEdit(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = `编辑${this.resourceName}`;
      this.daemonsetService.getById(id, 0).subscribe(
        status => {
          this.daemonset = status.data;
          this.daemonset.metaDataObj = JSON.parse(this.daemonset.metaData ? this.daemonset.metaData : '{}');
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = `创建${this.resourceName}`;
      this.daemonset = new DaemonSet();
      this.daemonset.metaDataObj = {};
      this.initJsonEditor();
    }
  }

  initJsonEditor(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.daemonset.metaDataObj));
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
    this.daemonset.metaData = this.aceBox.getValue();
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.daemonsetService.create(this.daemonset).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess(`创建${this.resourceName}成功！`);
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.daemonsetService.update(this.daemonset).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess(`更新${this.resourceName}成功！`);
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
      this.isNameValid &&
      !this.checkOnGoing &&
      !isUndefined(this.daemonset.appId);
  }

  // Handle the form validation
  handleValidation(): void {
    const cont = this.currentForm.controls['daemonset_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }

}

