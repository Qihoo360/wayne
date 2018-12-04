import { Component } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CacheService } from '../../../shared/auth/cache.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActivatedRoute } from '@angular/router';
import { KubeIngress } from '../../../shared/model/v1/kubernetes/ingress';
import { IngressClient } from '../../../shared/client/v1/kubernetes/ingress';
import { IngressTpl } from '../../../shared/model/v1/ingresstpl';

@Component({
  selector: 'status',
  templateUrl: 'status.component.html',
  styleUrls: ['status.scss']
})

export class IngressStatusComponent {
  createAppOpened: boolean = false;
  kubeIngress: KubeIngress;

  constructor(private messageHandlerService: MessageHandlerService,
              private ingressClient: IngressClient,
              private route: ActivatedRoute,
              public cacheService: CacheService) {
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id']);
  }

  newIngressStatus(cluster: string, ingressTpl: IngressTpl) {
    this.createAppOpened = true;

    const kubeIngress: KubeIngress = JSON.parse(ingressTpl.template);
    this.ingressClient.get(this.appId, cluster, this.cacheService.kubeNamespace, kubeIngress.metadata.name).subscribe(
      response => {
        this.kubeIngress = response.data;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }


}

