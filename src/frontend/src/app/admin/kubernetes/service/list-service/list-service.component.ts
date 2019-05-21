import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KubernetesListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';
import { KubeService } from '../../../../../../lib/shared/model/kubernetes/service';

@Component({
  selector: 'wayne-list-service',
  templateUrl: './list-service.component.html'
})

export class ListServiceComponent extends KubernetesListResource {
  @Input() resources: any[];
  @Input() showState: object;

  @Output() migration = new EventEmitter<any>();

  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }


  migrationResource(obj: any) {
    this.migration.emit(obj);
  }

  getPort(obj: KubeService) {
    const result = Array<string>();
    for (const port of obj.spec.ports) {
      if (port.nodePort) {
        result.push(`${port.targetPort}:${port.port}:${port.nodePort}/${port.protocol}`);
      } else {
        result.push(`${port.targetPort}:${port.port}/${port.protocol}`);
      }
    }
    return result.join(', ');
  }
}
