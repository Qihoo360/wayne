import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { isUndefined } from 'util';
import { DeploymentTpl } from '../../../shared/model/v1/deploymenttpl';
import { Deployment } from '../../../shared/model/v1/deployment';
import { DeploymentTplService } from '../../../shared/client/v1/deploymenttpl.service';
import { DeploymentService } from '../../../shared/client/v1/deployment.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'create-edit-deploymenttpl',
  templateUrl: 'create-edit-deploymenttpl.component.html',
  styleUrls: ['create-edit-deploymenttpl.scss']
})
export class CreateEditDeploymentTplComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  createDeploymentTplOpened: boolean;

  deploymentTplForm: NgForm;
  @ViewChild('deploymentTplForm', { static: true })
  currentForm: NgForm;

  deploymentTpl: DeploymentTpl = new DeploymentTpl();
  isSubmitOnGoing = false;

  deploymentTplTitle: string;
  actionType: ActionType;

  deployments: Deployment[];

  @ViewChild(AceEditorBoxComponent, { static: false }) aceBox: any;

  constructor(private deploymentTplService: DeploymentTplService,
              private deploymentService: DeploymentService,
              private messageHandlerService: MessageHandlerService,
              private aceEditorService: AceEditorService) {
  }

  ngOnInit(): void {
    this.deploymentService
      .getNames()
      .subscribe(
        response => {
          this.deployments = response.data;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  initJsonEditor(): void {
    let json = {};
    if (this.deploymentTpl && this.deploymentTpl.template) {
      json = JSON.parse(this.deploymentTpl.template);
    }
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(json));
  }

  newOrEditDeploymentTpl(id?: number) {
    this.createDeploymentTplOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.deploymentTplTitle = '编辑部署模版';
      this.deploymentTplService.getById(id, 0).subscribe(
        status => {
          this.deploymentTpl = status.data;
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.deploymentTplTitle = '创建部署模版';
      this.deploymentTpl = new DeploymentTpl();
      this.initJsonEditor();
    }
  }

  onCancel() {
    this.createDeploymentTplOpened = false;
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

    for (const deployment of this.deployments) {
      if (deployment.id === this.deploymentTpl.deploymentId) {
        this.deploymentTpl.name = deployment.name;
      }
    }
    this.deploymentTpl.template = this.aceBox.getValue();
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.deploymentTplService.create(this.deploymentTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createDeploymentTplOpened = false;
            this.messageHandlerService.showSuccess('创建部署模版成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createDeploymentTplOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.deploymentTplService.update(this.deploymentTpl, 0).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createDeploymentTplOpened = false;
            this.messageHandlerService.showSuccess('更新部署模版成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createDeploymentTplOpened = false;
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
      !isUndefined(this.deploymentTpl.deploymentId);
  }


}

