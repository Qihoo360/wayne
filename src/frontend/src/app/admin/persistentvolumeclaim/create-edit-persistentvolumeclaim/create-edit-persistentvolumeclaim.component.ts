import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { ActionType } from 'wayne-component/lib/shared.const';
import { App } from 'wayne-component/lib/model/v1/app';
import { PersistentVolumeClaimService } from 'wayne-component/lib/client/v1/persistentvolumeclaim.service';
import { PersistentVolumeClaim } from 'wayne-component/lib/model/v1/persistentvolumeclaim';
import { AppService } from 'wayne-component/lib/client/v1/app.service';
import { MessageHandlerService } from 'wayne-component';
import { AceEditorBoxComponent } from 'wayne-component/lib/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-persistentvolumeclaim',
  templateUrl: 'create-edit-persistentvolumeclaim.component.html',
  styleUrls: ['create-edit-persistentvolumeclaim.scss']
})
export class CreateEditPersistentVolumeClaimComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;

  @ViewChild(AceEditorBoxComponent)
  aceBox: any;

  pvc: PersistentVolumeClaim = new PersistentVolumeClaim();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  title: string;
  actionType: ActionType;

  apps: App[];

  constructor(private pvcService: PersistentVolumeClaimService,
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

  newOrEditPvc(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑PVC';
      this.pvcService.getById(id, 0).subscribe(
        status => {
          this.pvc = status.data;
          this.pvc.metaDataObj = JSON.parse(this.pvc.metaData ? this.pvc.metaData : '{}');
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建PVC';
      this.pvc = new PersistentVolumeClaim();
      this.pvc.metaDataObj = {};
      this.initJsonEditor();
    }
  }

  initJsonEditor(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.pvc.metaDataObj));
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
    this.pvc.metaData = this.aceBox.getValue();
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.pvcService.create(this.pvc).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建PVC成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.pvcService.update(this.pvc).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新PVC成功！');
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
      !this.checkOnGoing;
  }

  // Handle the form validation
  handleValidation(): void {
    const cont = this.currentForm.controls['name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }

  }

}

