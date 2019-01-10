import { Component } from '@angular/core';
import { CacheService } from '../../../shared/auth/cache.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActivatedRoute } from '@angular/router';
import { ResourceStatus } from '../../../shared/base/resource/resource-status';
import { AutoscaleClient } from '../../../shared/client/v1/kubernetes/autoscale';

@Component({
  selector: 'wayne-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent extends ResourceStatus {
  constructor(public messageHandlerService: MessageHandlerService,
    public autoscaleClient: AutoscaleClient,
    public route: ActivatedRoute,
    public cacheService: CacheService) {
    super(messageHandlerService, autoscaleClient, route, cacheService);
  }
}
