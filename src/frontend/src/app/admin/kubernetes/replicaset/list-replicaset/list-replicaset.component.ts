import { Component,  EventEmitter, Input, Output  } from '@angular/core';
import { KubernetesListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';

@Component({
  selector: 'wayne-list-replicaset',
  templateUrl: './list-replicaset.component.html'
})

export class ListReplicasetComponent extends KubernetesListResource {
  @Input() resources: any[];
  @Input() showState: object;
  @Output() jump = new EventEmitter<any>();

  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }

  isReady(obj: any): boolean {
    const readyNumber = obj.status.readyReplicas ? obj.status.readyReplicas : 0;
    const desiredNumber = obj.spec.replicas;
    return readyNumber === desiredNumber;
  }

  jumpResource(obj: any) {
    this.jump.emit(obj);
  }
}
