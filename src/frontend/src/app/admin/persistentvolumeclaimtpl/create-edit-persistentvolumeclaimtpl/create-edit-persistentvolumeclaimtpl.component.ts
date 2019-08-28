import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { ActionType } from '../../../shared/shared.const';
import { isUndefined } from 'util';
import { PersistentVolumeClaimTpl } from '../../../shared/model/v1/persistentvolumeclaimtpl';
import { PersistentVolumeClaim } from '../../../shared/model/v1/persistentvolumeclaim';
import { PersistentVolumeClaimTplService } from '../../../shared/client/v1/persistentvolumeclaimtpl.service';
import { PersistentVolumeClaimService } from '../../../shared/client/v1/persistentvolumeclaim.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-persistentvolumeclaimtpl',
  templateUrl: 'create-edit-persistentvolumeclaimtpl.component.html',
  styleUrls: ['create-edit-persistentvolumeclaimtpl.scss']
})
export class CreateEditPersistentVolumeClaimTplComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;

  pvcTpl: PersistentVolumeClaimTpl = new PersistentVolumeClaimTpl();
  checkOnGoing = false;
  isSubmitOnGoing = false;

  title: string;
  actionType: ActionType;

  pvcs: PersistentVolumeClaim[];

  @ViewChild(AceEditorBoxComponent, { static: false }) aceBox: any;

  constructor(private pvcTplService: PersistentVolumeClaimTplService,
              private pvcService: PersistentVolumeClaimService,
              private messageHandlerService: MessageHandlerService,
              private aceEditorService: AceEditorService) {
  }

  ngOnInit(): void {
    this.pvcService.getNames().subscribe(
      response => {
        this.pvcs = response.data;
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  initJsonEditor(): void {
    let json = {};
    if (this.pvcTpl && this.pvcTpl.template) {
      json = JSON.parse(this.pvcTpl.template);
    }
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(json));
  }

  newOrEditTpl(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑PVC模版';
      this.pvcTplService.getById(id, 0).subscribe(
        status => {
          this.pvcTpl = status.data;
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建PVC模版';
      this.pvcTpl = new PersistentVolumeClaimTpl();
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
    this.pvcTpl.template = this.aceBox.getValue();
    for (const svc of this.pvcs) {
      if (svc.id === this.pvcTpl.persistentVolumeClaimId) {
        this.pvcTpl.name = svc.name;
      }
    }
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.pvcTplService.create(this.pvcTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建PVC模版成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.pvcTplService.update(this.pvcTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新PVC模版成功！');
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
      !isUndefined(this.pvcTpl.persistentVolumeClaimId);
  }


}

