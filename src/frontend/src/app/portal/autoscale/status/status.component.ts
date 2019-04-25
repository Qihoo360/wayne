import { Component } from '@angular/core';
import { CacheService } from 'wayne-component/lib/auth/cache.service';
import { MessageHandlerService } from 'wayne-component';
import { ActivatedRoute } from '@angular/router';
import { ResourceStatus } from 'wayne-component/lib/base/resource/resource-status';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';

@Component({
  selector: 'wayne-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent extends ResourceStatus {
  constructor(public messageHandlerService: MessageHandlerService,
              public kubernetesClient: KubernetesClient,
              public route: ActivatedRoute,
              public cacheService: CacheService) {
    super(messageHandlerService, kubernetesClient, route, cacheService);
  }
}
