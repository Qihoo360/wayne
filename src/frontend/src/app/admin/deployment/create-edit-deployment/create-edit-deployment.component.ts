import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { isUndefined } from 'util';
import { App } from '../../../shared/model/v1/app';
import { AppService } from '../../../shared/client/v1/app.service';
import { Deployment } from '../../../shared/model/v1/deployment';
import { DeploymentService } from '../../../shared/client/v1/deployment.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-deployment',
  templateUrl: 'create-edit-deployment.component.html',
  styleUrls: ['create-edit-deployment.scss']
})
export class CreateEditDeploymentComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  createDeploymentOpened: boolean;

  deploymentForm: NgForm;
  @ViewChild('deploymentForm', { static: true })
  currentForm: NgForm;

  @ViewChild(AceEditorBoxComponent, { static: false })
  aceBox: any;

  deployment: Deployment = new Deployment();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  deploymentTitle: string;
  actionType: ActionType;

  apps: App[];

  constructor(private deploymentService: DeploymentService,
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

  newOrEditDeployment(id?: number) {
    this.createDeploymentOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.deploymentTitle = '编辑部署';
      this.deploymentService.getById(id, 0).subscribe(
        status => {
          this.deployment = status.data;
          this.deployment.metaDataObj = JSON.parse(this.deployment.metaData ? this.deployment.metaData : '{}');
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.deploymentTitle = '创建部署';
      this.deployment = new Deployment();
      this.deployment.metaDataObj = {};
      this.initJsonEditor();
    }
  }

  initJsonEditor(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.deployment.metaDataObj));
  }

  onCancel() {
    this.createDeploymentOpened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.deployment.metaData = this.aceBox.getValue();
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.deploymentService.create(this.deployment).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createDeploymentOpened = false;
            this.messageHandlerService.showSuccess('创建部署成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createDeploymentOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.deploymentService.update(this.deployment).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createDeploymentOpened = false;
            this.messageHandlerService.showSuccess('更新部署成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createDeploymentOpened = false;
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
      !isUndefined(this.deployment.appId);
  }

  // Handle the form validation
  handleValidation(): void {
    const cont = this.currentForm.controls['deployment_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }

  }

}

