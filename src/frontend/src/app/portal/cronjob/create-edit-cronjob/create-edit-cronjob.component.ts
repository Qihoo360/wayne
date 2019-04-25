import { Component } from '@angular/core';
import { MessageHandlerService } from 'wayne-component';
import 'rxjs/add/observable/combineLatest';
import { Cronjob } from 'wayne-component/lib/model/v1/cronjob';
import { CronjobService } from 'wayne-component/lib/client/v1/cronjob.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { CreateEditLimitResource } from 'wayne-component/lib/base/resource/create-edit-limit-resource';

@Component({
  selector: 'create-edit-cronjob',
  templateUrl: 'create-edit-cronjob.component.html',
  styleUrls: ['create-edit-cronjob.scss']
})

export class CreateEditCronjobComponent extends CreateEditLimitResource {
  defaultClusterNum = 1;
  constructor(
    public cronjobService: CronjobService,
    public authService: AuthService,
    public messageHandlerService: MessageHandlerService
  ) {
    super(cronjobService, authService, messageHandlerService);
    this.registResource(new Cronjob);
    this.registResourceType('计划任务');
  }

  formatMetaData() {
    // cronjob 添加了 suspends, successfulJobsHistoryLimit, failedJobsHistoryLimit 参数
    if (!this.resource.metaData) {
      this.resource.metaData = '{}';
    }
    const metaData = JSON.parse(this.resource.metaData);
    const replicas = {};
    const suspends = {};
    for (const clu of this.clusters) {
      const clusterMeta = this.clusterMetas[clu.name];
      if (clusterMeta && clusterMeta.checked && clusterMeta.value) {
        replicas[clu.name] = clusterMeta.value;
        suspends[clu.name] = false;
      }
    }
    metaData.replicas = replicas;
    metaData.suspends = suspends;
    if (!metaData.successfulJobsHistoryLimit) {
      metaData.successfulJobsHistoryLimit = 3;
    }
    if (!metaData.failedJobsHistoryLimit) {
      metaData.failedJobsHistoryLimit = 3;
    }
    metaData.resources = this.resourceLimitComponent.getValue();
    this.resource.metaData = JSON.stringify(metaData);
  }
}
