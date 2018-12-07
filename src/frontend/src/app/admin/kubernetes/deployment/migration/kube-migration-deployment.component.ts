import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AceEditorBoxComponent } from '../../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { App } from '../../../../shared/model/v1/app';
import { DeploymentService } from '../../../../shared/client/v1/deployment.service';
import { AppService } from '../../../../shared/client/v1/app.service';
import { AceEditorService } from '../../../../shared/ace-editor/ace-editor.service';
import { MessageHandlerService } from '../../../../shared/message-handler/message-handler.service';
import { AceEditorMsg } from '../../../../shared/ace-editor/ace-editor';
import { isUndefined } from 'util';
import { KubeDeployment } from '../../../../shared/model/v1/kubernetes/deployment';
import { defaultDeployment } from '../../../../shared/default-models/deployment.const';
import { AuthService } from '../../../../shared/auth/auth.service';
import { Deployment, DeploymentMetaData } from '../../../../shared/model/v1/deployment';
import { DeploymentTplService } from '../../../../shared/client/v1/deploymenttpl.service';
import { DeploymentTpl } from '../../../../shared/model/v1/deploymenttpl';

@Component({
  selector: 'kube-migration-deployment',
  templateUrl: 'kube-migration-deployment.component.html'
})
export class KubeMigrationDeploymentComponent implements OnInit {

  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  @ViewChild('ngForm')
  currentForm: NgForm;

  @ViewChild(AceEditorBoxComponent)
  aceBox: any;

  deployment: KubeDeployment;
  isSubmitOnGoing = false;

  warningMsg: string;
  cluster: string;

  apps: App[];
  selectedApp: App;

  constructor(private deploymentService: DeploymentService,
              private deploymentTplService: DeploymentTplService,
              private appService: AppService,
              public authService: AuthService,
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

  openModal(cluster: string, deployment: KubeDeployment) {
    this.modalOpened = true;
    this.isSubmitOnGoing = false;
    this.warningMsg = '';
    this.cluster = cluster;

    this.deployment = JSON.parse(defaultDeployment);
    this.deployment.metadata.name = deployment.metadata.name;
    this.deployment.metadata.labels = deployment.metadata.labels;
    this.deployment.metadata.annotations = deployment.metadata.annotations;
    this.deployment.spec = deployment.spec;
    this.validLabel(deployment);
    this.initJsonEditor();
  }

  initJsonEditor(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.deployment));
  }

  validLabel(deployment: KubeDeployment) {
    const app = deployment.spec.selector.matchLabels['app'];
    if (!app) {
      this.warningMsg = '.spec.selector.matchLabels 没有app标签，直接发布可能会导致游离的rs！';
    }
    if (app !== deployment.metadata.name) {
      this.warningMsg = '.spec.selector.matchLabels app标签和部署名称不一致，直接发布可能会导致游离的rs！';
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
    const deployment = new Deployment();
    deployment.name = this.deployment.metadata.name;
    deployment.appId = this.selectedApp.id;
    const metaData = new DeploymentMetaData();
    metaData.replicas = {[this.cluster]: this.deployment.spec.replicas};
    deployment.metaData = JSON.stringify(metaData);
    this.deploymentService.create(deployment).subscribe(
      resp => {
        const data = resp.data;
        const deploymentTpl = new DeploymentTpl();
        deploymentTpl.name = this.deployment.metadata.name;
        deploymentTpl.deploymentId = data.id;
        deploymentTpl.template = JSON.stringify(this.deployment);
        deploymentTpl.description = 'migration from kubernetes. ';
        this.deploymentTplService.create(deploymentTpl, this.selectedApp.id).subscribe(
          () => {
            this.messageHandlerService.showSuccess('创建部署和部署模版成功！请前往前台手动发布部署到相应机房！');
          },
          error => {
            this.messageHandlerService.handleError(error);
          });
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
    this.modalOpened = false;
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      !isUndefined(this.selectedApp);
  }

}
