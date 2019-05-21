import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KubernetesListResource } from 'wayne-component/lib/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from 'wayne-component/lib/tpl-detail/tpl-detail.service';

@Component({
  selector: 'wayne-list-daemonset',
  templateUrl: './list-daemonset.component.html'
})

export class ListDaemonsetComponent extends KubernetesListResource {
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
