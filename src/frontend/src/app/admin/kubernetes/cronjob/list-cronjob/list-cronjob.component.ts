import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KubernetesListResource } from '../../../../shared/base/kubernetes-namespaced/kubernetes-list-resource';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';
import { KubeCronJob } from '../../../../shared/model/v1/kubernetes/cronjob';

@Component({
  selector: 'wayne-list-cronjob',
  templateUrl: './list-cronjob.component.html'
})

export class ListCronjobComponent extends KubernetesListResource {
  @Input() resources: any[];
  @Input() showState: object;

  @Output() migration = new EventEmitter<any>();

  constructor(public tplDetailService: TplDetailService) {
    super(tplDetailService);
  }

  getActiveJobs(obj: KubeCronJob): number {
    return obj.status.active ? obj.status.active.length : 0;
  }

  migrationResource(obj: any) {
    this.migration.emit(obj);
  }
}
