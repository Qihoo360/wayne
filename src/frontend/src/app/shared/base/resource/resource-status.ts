import { CacheService } from '../../auth/cache.service';
import { ActivatedRoute } from '@angular/router';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { KubernetesClient } from '../../client/v1/kubernetes/kubernetes';
import { KubeResourcesName } from '../../shared.const';

export class ResourceStatus {
  statusOpened = false;
  kubeResource: any;

  constructor(public messageHandlerService: MessageHandlerService,
              public kubernetesClient: KubernetesClient,
              public route: ActivatedRoute,
              public cacheService: CacheService) {
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }

  newResourceStatus(cluster: string, template: any, kubeResourceName: KubeResourcesName) {
    this.statusOpened = true;

    const KubeObj = JSON.parse(template.template);
    this.kubernetesClient.get(cluster, kubeResourceName, KubeObj.metadata.name, this.cacheService.kubeNamespace,
      this.appId.toString()).subscribe(
      response => {
        this.kubeResource = response.data;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }
}
