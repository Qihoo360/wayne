import { Component, Input } from '@angular/core';
import { KubernetesListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';
import { KubeService } from '../../../../../../lib/shared/model/kubernetes/service';

@Component({
  selector: 'wayne-list-endpoint',
  templateUrl: './list-endpoint.component.html'
})

export class ListEndpointComponent extends KubernetesListResource {
  @Input() resources: any[];
  @Input() showState: object;

  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
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
