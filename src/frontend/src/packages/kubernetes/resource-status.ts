import { CacheService } from '../../app/shared/auth/cache.service';
import { ActivatedRoute } from '@angular/router';
import { MessageHandlerService } from '../../app/shared/message-handler/message-handler.service';

export class ResourceStatus {
  statusOpened = false;
  kubeResource: any;

  constructor(public messageHandlerService: MessageHandlerService,
              public resourceClient: any,
              public route: ActivatedRoute,
              public cacheService: CacheService) {
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }

  newResourceStatus(cluster: string, template: any) {
    this.statusOpened = true;

    const KubeObj = JSON.parse(template.template);
    this.resourceClient.get(this.appId, cluster, this.cacheService.kubeNamespace, KubeObj.metadata.name).subscribe(
      response => {
        this.kubeResource = response.data;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }
}
