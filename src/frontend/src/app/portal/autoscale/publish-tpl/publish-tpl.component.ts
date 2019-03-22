import { Component } from '@angular/core';
import { PublishStatusService } from '../../../shared/client/v1/publishstatus.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { PublishTemplate } from '../../../shared/base/resource/publish-template';
import { AutoscaleService } from '../../../shared/client/v1/autoscale.service';
import { AutoscaleClient } from '../../../shared/client/v1/kubernetes/autoscale';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { KubeResourceHorizontalPodAutoscaler } from '../../../shared/shared.const';

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
