import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KubernetesNamespacedListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-namespaced-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';

@Component({
  selector: 'wayne-list-secret',
  templateUrl: './list-secret.component.html'
})

export class ListSecretComponent extends KubernetesNamespacedListResource {
  @Input() resources: any[];
  @Input() showState: object;

  @Output() migration = new EventEmitter<any>();

  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }


  migrationResource(obj: any) {
    this.migration.emit(obj);
  }
}
