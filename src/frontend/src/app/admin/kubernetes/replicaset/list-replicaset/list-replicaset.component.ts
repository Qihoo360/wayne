import { Component, Input } from '@angular/core';
import { KubernetesNamespacedListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-namespaced-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';

@Component({
  selector: 'wayne-list-replicaset',
  templateUrl: './list-replicaset.component.html'
})

export class ListReplicasetComponent extends KubernetesNamespacedListResource {
  @Input() resources: any[];
  @Input() showState: object;

  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }

  isReady(obj: any): boolean {
    const readyNumber = obj.status.readyReplicas ? obj.status.readyReplicas : 0;
    const desiredNumber = obj.spec.replicas;
    return readyNumber === desiredNumber;
  }

}
