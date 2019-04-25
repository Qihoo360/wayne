import { Component } from '@angular/core';
import { PublishStatusService } from 'wayne-component/lib/client/v1/publishstatus.service';
import { CacheService } from 'wayne-component/lib/auth/cache.service';
import { MessageHandlerService } from 'wayne-component';
import { PublishTemplate } from 'wayne-component/lib/base/resource/publish-template';
import { AutoscaleService } from 'wayne-component/lib/client/v1/autoscale.service';
import { AutoscaleClient } from 'wayne-component/lib/client/v1/kubernetes/autoscale';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { KubeResourceHorizontalPodAutoscaler } from 'wayne-component/lib/shared.const';

@Component({
  selector: 'wayne-publish-tpl',
  templateUrl: './publish-tpl.component.html',
  styleUrls: ['./publish-tpl.component.scss']
})
export class PublishTplComponent extends PublishTemplate {

  constructor(public messageHandlerService: MessageHandlerService,
              public cacheService: CacheService,
              public autoscaleService: AutoscaleService,
              public autoscaleClient: AutoscaleClient,
              public kubernetesClient: KubernetesClient,
              public publishStatusService: PublishStatusService) {
    super(messageHandlerService, cacheService, autoscaleService, autoscaleClient, kubernetesClient, publishStatusService);
    super.registResourceType('HPA');
    super.registKubeResource(KubeResourceHorizontalPodAutoscaler);
  }

  public getResourceId() {
    return this.template.hpaId;
  }

}
