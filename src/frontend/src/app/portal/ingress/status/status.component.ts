import { Component } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CacheService } from '../../../shared/auth/cache.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActivatedRoute } from '@angular/router';
import { IngressClient } from '../../../shared/client/v1/kubernetes/ingress';
import { ResourceStatus } from '../../../shared/base/resource/resource-status';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';

@Component({
  selector: 'status',
  templateUrl: 'status.component.html',
  styleUrls: ['status.scss']
})

export class IngressStatusComponent extends ResourceStatus {
  constructor(public messageHandlerService: MessageHandlerService,
              public kubernetesClient: KubernetesClient,
              public route: ActivatedRoute,
              public cacheService: CacheService) {
    super(messageHandlerService, kubernetesClient, route, cacheService);
  }
}

