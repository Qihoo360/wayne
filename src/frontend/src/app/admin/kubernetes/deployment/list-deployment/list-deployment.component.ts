import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KubernetesListResource } from 'wayne-component/lib/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from 'wayne-component/lib/tpl-detail/tpl-detail.service';

@Component({
  selector: 'wayne-list-deployment',
  templateUrl: './list-deployment.component.html'
})

export class ListDeploymentComponent extends KubernetesListResource {
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
