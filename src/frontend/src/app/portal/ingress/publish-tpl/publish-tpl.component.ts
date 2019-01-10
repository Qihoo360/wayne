import { Component } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { PublishStatusService } from '../../../shared/client/v1/publishstatus.service';
import { IngressService } from '../../../shared/client/v1/ingress.service';
import { IngressClient } from '../../../shared/client/v1/kubernetes/ingress';
import { Ingress } from '../../../shared/model/v1/ingress';
import { PublishTemplate } from '../../../shared/base/resource/publish-template';

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
              public publishStatusService: PublishStatusService) {
    super(messageHandlerService, cacheService, ingressService, ingressClient, publishStatusService);
    super.registResourceType('Ingress');
  }

  public getResourceId() {
    return this.template.ingressId;
  }
}

