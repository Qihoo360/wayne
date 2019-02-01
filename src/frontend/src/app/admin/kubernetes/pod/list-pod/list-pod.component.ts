import { Component, Input } from '@angular/core';
import { KubernetesNamespacedListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-namespaced-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';
import { KubePod } from '../../../../shared/model/v1/kubernetes/kubepod';


@Component({
  selector: 'wayne-list-pod',
  templateUrl: './list-pod.component.html'
})

export class ListPodComponent extends KubernetesNamespacedListResource {
  @Input() resources: any[];
  @Input() showState: object;

  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }

  // getPodStatus returns the pod state
  getPodStatus(pod: KubePod): string {
    // Terminating
    if (pod.metadata.deletionTimestamp) {
      return 'Terminating';
    }

    // not running
    if (pod.status.phase !== 'Running') {
      return pod.status.phase;
    }

    let ready = false;
    let notReadyReason = '';
    for (const c of pod.status.conditions) {
      if (c.type === 'Ready') {
        ready = c.status === 'True';
        notReadyReason = c.reason;
      }
    }

    if (pod.status.reason) {
      return pod.status.reason;
    }

    if (notReadyReason) {
      return notReadyReason;
    }

    if (ready) {
      return 'Running';
    }

    // Unknown?
    return 'Unknown';
  }

}
