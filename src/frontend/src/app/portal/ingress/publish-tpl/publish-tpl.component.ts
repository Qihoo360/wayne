import { Component } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MessageHandlerService } from 'wayne-component';
import { CacheService } from 'wayne-component/lib/auth/cache.service';
import { PublishStatusService } from 'wayne-component/lib/client/v1/publishstatus.service';
import { IngressService } from 'wayne-component/lib/client/v1/ingress.service';
import { IngressClient } from 'wayne-component/lib/client/v1/kubernetes/ingress';
import { Ingress } from 'wayne-component/lib/model/v1/ingress';
import { PublishTemplate } from 'wayne-component/lib/base/resource/publish-template';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { KubeResourceIngress } from 'wayne-component/lib/shared.const';

@Component({
  selector: 'publish-tpl',
  templateUrl: 'publish-tpl.component.html',
  styleUrls: ['publish-tpl.scss']
})
export class PublishIngressTplComponent extends PublishTemplate {
  constructor(public messageHandlerService: MessageHandlerService,
              public cacheService: CacheService,
              public ingressService: IngressService,
              public ingressClient: IngressClient,
              public kubernetesClient: KubernetesClient,
              public publishStatusService: PublishStatusService) {
    super(messageHandlerService, cacheService, ingressService, ingressClient, kubernetesClient, publishStatusService);
    super.registResourceType('Ingress');
    super.registKubeResource(KubeResourceIngress);
  }

  public getResourceId() {
    return this.template.ingressId;
  }
}

