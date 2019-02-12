import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../shared/client/v1/app.service';
import { AceEditorService } from '../../../../shared/ace-editor/ace-editor.service';
import { MessageHandlerService } from '../../../../shared/message-handler/message-handler.service';
import { ServiceService } from '../../../../../../lib/shared/client/v1/service.service';
import { ServiceTplService } from '../../../../../../lib/shared/client/v1/servicetpl.service';
import { Service } from '../../../../../../lib/shared/model/service';
import { ServiceTpl } from '../../../../../../lib/shared/model/servicetpl';
import { MigrationResource } from '../../../../shared/base/kubernetes-namespaced/migration-resource';
import { KubernetesClient } from '../../../../shared/client/v1/kubernetes/kubernetes';
import { KubeResourceService } from '../../../../shared/shared.const';

@Component({
  selector: 'kube-migration',
  templateUrl: 'migration.component.html'
})
export class MigrationComponent extends MigrationResource implements OnInit {

  constructor(private serviceService: ServiceService,
              private serviceTplService: ServiceTplService,
              public appService: AppService,
              public kubernetesClient: KubernetesClient,
              public aceEditorService: AceEditorService,
              public messageHandlerService: MessageHandlerService) {
    super(kubernetesClient, appService, aceEditorService, messageHandlerService);
    super.registKubeResource(KubeResourceService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    const resource = new Service();
    resource.name = this.obj.metadata.name;
    resource.appId = this.selectedApp.id;
    this.serviceService.create(resource).subscribe(
      resp => {
        const data = resp.data;
        const tpl = new ServiceTpl();
        tpl.name = this.obj.metadata.name;
        tpl.serviceId = data.id;
        tpl.template = JSON.stringify(this.obj);
        tpl.description = 'migration from kubernetes. ';
        this.serviceTplService.create(tpl, this.selectedApp.id).subscribe(
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
