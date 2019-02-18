import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../shared/client/v1/app.service';
import { AceEditorService } from '../../../../shared/ace-editor/ace-editor.service';
import { MessageHandlerService } from '../../../../shared/message-handler/message-handler.service';
import { MigrationResource } from '../../../../shared/base/kubernetes-namespaced/migration-resource';
import { KubernetesClient } from '../../../../shared/client/v1/kubernetes/kubernetes';
import { KubeResourceCronJob } from '../../../../shared/shared.const';
import { CronjobService } from '../../../../shared/client/v1/cronjob.service';
import { CronjobTplService } from '../../../../shared/client/v1/cronjobtpl.service';
import { Cronjob } from '../../../../shared/model/v1/cronjob';
import { CronjobTpl } from '../../../../shared/model/v1/cronjobtpl';

@Component({
  selector: 'kube-migration',
  templateUrl: 'migration.component.html'
})
export class MigrationComponent extends MigrationResource implements OnInit {

  constructor(private cronjobService: CronjobService,
              private cronjobTplService: CronjobTplService,
              public appService: AppService,
              public kubernetesClient: KubernetesClient,
              public aceEditorService: AceEditorService,
              public messageHandlerService: MessageHandlerService) {
    super(kubernetesClient, appService, aceEditorService, messageHandlerService);
    super.registKubeResource(KubeResourceCronJob);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    const resource = new Cronjob();
    resource.name = this.obj.metadata.name;
    resource.appId = this.selectedApp.id;
    this.cronjobService.create(resource).subscribe(
      resp => {
        const data = resp.data;
        const tpl = new CronjobTpl();
        tpl.name = this.obj.metadata.name;
        tpl.cronjobId = data.id;
        tpl.template = JSON.stringify(this.obj);
        tpl.description = 'migration from kubernetes. ';
        this.cronjobTplService.create(tpl, this.selectedApp.id).subscribe(
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
