import { Component, Input } from '@angular/core';
import { KubernetesListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';

@Component({
  selector: 'wayne-list-storageclass',
  templateUrl: './list-storageclass.component.html'
})

export class ListStorageclassComponent extends KubernetesListResource {
  @Input() resources: any[];
  @Input() showState: object;

  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }

  isReady(obj: any): boolean {
    const readyNumber = obj.status.succeeded ? obj.status.succeeded : 0;
    const desiredNumber = obj.spec.completions;
    return readyNumber === desiredNumber;
  }

}
