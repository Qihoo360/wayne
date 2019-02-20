import { Component, Input } from '@angular/core';
import { KubernetesListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';

@Component({
  selector: 'wayne-list-rolebinding',
  templateUrl: './list-rolebinding.component.html'
})

export class ListRolebindingComponent extends KubernetesListResource {
  @Input() resources: any[];
  @Input() showState: object;


  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }

}
