import { Component, Input } from '@angular/core';
import { KubernetesListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';
import { KubePod } from '../../../../shared/model/v1/kubernetes/kubepod';
import { KubePodUtil } from '../../../../shared/utils';
import { KubeResourcePod } from '../../../../shared/shared.const';


@Component({
  selector: 'wayne-list-pod',
  templateUrl: './list-pod.component.html'
})

export class ListPodComponent extends KubernetesListResource {
  @Input() resources: any[];
  @Input() showState: object;
  @Input() cluster: string;

  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }

  enterContainer(pod: KubePod): void {
    const url = `portal/namespace/0/app/0/${KubeResourcePod}` +
      `/${pod.metadata.name}/pod/${pod.metadata.name}/terminal/${this.cluster}/${pod.metadata.namespace}`;
    window.open(url, '_blank');
  }

  podLog(pod: KubePod): void {
    const url = `portal/logging/namespace/0/app/0/${KubeResourcePod}/${pod.metadata.name}` +
      `/pod/${pod.metadata.name}/${this.cluster}/${pod.metadata.namespace}`;
    window.open(url, '_blank');
  }

  // getPodStatus returns the pod state
  getPodStatus(pod: KubePod): string {
    return KubePodUtil.getPodStatus(pod);
  }

}
