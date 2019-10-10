import { OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AceEditorBoxComponent } from '../../ace-editor/ace-editor-box/ace-editor-box.component';
import { App } from '../../model/v1/app';
import { AppService } from '../../client/v1/app.service';
import { AceEditorService } from '../../ace-editor/ace-editor.service';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { AceEditorMsg } from '../../ace-editor/ace-editor';
import { KubernetesClient } from '../../client/v1/kubernetes/kubernetes';
import { KubeResourcesName } from '../../shared.const';


export class MigrationResource implements OnInit {
  modalOpened: boolean;
  kubeResource: KubeResourcesName;

  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;

  @ViewChild(AceEditorBoxComponent, { static: false })
  aceBox: any;

  obj: any;
  isSubmitOnGoing = false;
  cluster: string;

  apps: App[];
  selectedApp: App;

  constructor(public kubernetesClient: KubernetesClient,
              public appService: AppService,
              public aceEditorService: AceEditorService,
              public messageHandlerService: MessageHandlerService) {

  }

  registKubeResource(kubeResource: string) {
    this.kubeResource = kubeResource;
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

  openModal(cluster: string, obj: any) {
    this.modalOpened = true;
    this.isSubmitOnGoing = false;
    this.cluster = cluster;
    this.kubernetesClient.get(this.cluster, this.kubeResource, obj.metadata.name, obj.metadata.namespace)
      .subscribe(
        response => {
          const data = response.data;
          data.status = undefined;
          data.metadata.selfLink = undefined;
          data.metadata.uid = undefined;
          data.metadata.resourceVersion = undefined;
          data.metadata.creationTimestamp = undefined;
          this.obj = data;
          this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.obj));
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  onCancel() {
    this.modalOpened = false;
    this.currentForm.reset();
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.selectedApp != null;
  }
}
