import { Component, Input } from '@angular/core';
import { KubernetesListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';

@Component({
  selector: 'wayne-list-role',
  templateUrl: './list-role.component.html'
})

export class ListRoleComponent extends KubernetesListResource {
  @Input() resources: any[];
  @Input() showState: object;


  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }

}
