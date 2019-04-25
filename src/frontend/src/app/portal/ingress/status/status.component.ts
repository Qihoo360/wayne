import { Component } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CacheService } from 'wayne-component/lib/auth/cache.service';
import { MessageHandlerService } from 'wayne-component';
import { ActivatedRoute } from '@angular/router';
import { IngressClient } from 'wayne-component/lib/client/v1/kubernetes/ingress';
import { ResourceStatus } from 'wayne-component/lib/base/resource/resource-status';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';

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

