import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../shared/client/v1/app.service';
import { AceEditorService } from '../../../../shared/ace-editor/ace-editor.service';
import { MessageHandlerService } from '../../../../shared/message-handler/message-handler.service';
import { MigrationResource } from '../../../../shared/base/kubernetes-namespaced/migration-resource';
import { KubernetesClient } from '../../../../shared/client/v1/kubernetes/kubernetes';
import { KubeResourceDeployment } from '../../../../shared/shared.const';
import { DeploymentService } from '../../../../shared/client/v1/deployment.service';
import { DeploymentTplService } from '../../../../shared/client/v1/deploymenttpl.service';
import { Deployment } from '../../../../shared/model/v1/deployment';
import { DeploymentTpl } from '../../../../shared/model/v1/deploymenttpl';

@Component({
  selector: 'kube-migration',
  templateUrl: 'migration.component.html'
})
export class MigrationComponent extends MigrationResource implements OnInit {

  constructor(private deploymentService: DeploymentService,
              private deploymentTplService: DeploymentTplService,
              public appService: AppService,
              public kubernetesClient: KubernetesClient,
              public aceEditorService: AceEditorService,
              public messageHandlerService: MessageHandlerService) {
    super(kubernetesClient, appService, aceEditorService, messageHandlerService);
    super.registKubeResource(KubeResourceDeployment);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    const resource = new Deployment();
    resource.name = this.obj.metadata.name;
    resource.appId = this.selectedApp.id;
    this.deploymentService.create(resource).subscribe(
      resp => {
        const data = resp.data;
        const tpl = new DeploymentTpl();
        tpl.name = this.obj.metadata.name;
        tpl.deploymentId = data.id;
        tpl.template = JSON.stringify(this.obj);
        tpl.description = 'migration from kubernetes. ';
        this.deploymentTplService.create(tpl, this.selectedApp.id).subscribe(
          () => {
            this.messageHandlerService.showSuccess('资源创建成功！请前往前台手动发布到相应机房！');
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

}
