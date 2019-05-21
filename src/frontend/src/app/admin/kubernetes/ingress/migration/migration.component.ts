import { Component, OnInit } from '@angular/core';
import { AppService } from 'wayne-component/lib/client/v1/app.service';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { MessageHandlerService } from 'wayne-component';
import { MigrationResource } from 'wayne-component/lib/base/kubernetes-namespaced/migration-resource';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { KubeResourceIngress } from 'wayne-component/lib/shared.const';
import { Ingress } from 'wayne-component/lib/model/v1/ingress';
import { IngressTpl } from 'wayne-component/lib/model/v1/ingresstpl';
import { IngressService } from 'wayne-component/lib/client/v1/ingress.service';
import { IngressTplService } from 'wayne-component/lib/client/v1/ingresstpl.service';

@Component({
  selector: 'kube-migration',
  templateUrl: 'migration.component.html'
})
export class MigrationComponent extends MigrationResource implements OnInit {

  constructor(private ingressService: IngressService,
              private ingressTplService: IngressTplService,
              public appService: AppService,
              public kubernetesClient: KubernetesClient,
              public aceEditorService: AceEditorService,
              public messageHandlerService: MessageHandlerService) {
    super(kubernetesClient, appService, aceEditorService, messageHandlerService);
    super.registKubeResource(KubeResourceIngress);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    const resource = new Ingress();
    resource.name = this.obj.metadata.name;
    resource.appId = this.selectedApp.id;
    this.ingressService.create(resource).subscribe(
      resp => {
        const data = resp.data;
        const tpl = new IngressTpl();
        tpl.name = this.obj.metadata.name;
        tpl.ingressId = data.id;
        tpl.template = JSON.stringify(this.obj);
        tpl.description = 'migration from kubernetes. ';
        this.ingressTplService.create(tpl, this.selectedApp.id).subscribe(
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
