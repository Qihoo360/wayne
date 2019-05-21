import { Component, Input } from '@angular/core';
import { KubernetesListResource } from 'wayne-component/lib/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from 'wayne-component/lib/tpl-detail/tpl-detail.service';

@Component({
  selector: 'wayne-list-serviceaccount',
  templateUrl: './list-serviceaccount.component.html'
})

export class ListServiceaccountComponent extends KubernetesListResource {
  @Input() resources: any[];
  @Input() showState: object;


  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }

}
