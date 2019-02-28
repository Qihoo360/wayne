import { Component } from '@angular/core';
import { DaemonSet } from '../../../shared/model/v1/daemonset';
import { DaemonSetService } from '../../../shared/client/v1/daemonset.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ClusterMeta } from '../../../shared/model/v1/cluster';
import { CreateEditLimitResource } from '../../../shared/base/resource/create-edit-limit-resource';

@Component({
  selector: 'create-edit-daemonset',
  templateUrl: 'create-edit-daemonset.component.html',
  styleUrls: ['create-edit-daemonset.scss']
})
export class CreateEditDaemonSetComponent extends CreateEditLimitResource {
  defaultClusterNum = 1;
  constructor(
    public daemonSetService: DaemonSetService,
    public authService: AuthService,
    public translate: TranslateService,
    public messageHandlerService: MessageHandlerService) {
    super(daemonSetService, authService, messageHandlerService);
    this.registResource(new DaemonSet);
    this.registResourceType('守护进程集');
  }

  setMetaData() {
    this.resource.metaData = this.resource.metaData ? this.resource.metaData : '{}';
    const metaData = JSON.parse(this.resource.metaData);
    if (metaData['clusters']) {
      for (const cluster of metaData['clusters']) {
        for (let i = 0; i < this.clusters.length; i++) {
          if (cluster === this.clusters[i].name) {
            this.clusterMetas[cluster] = new ClusterMeta(true, this.defaultClusterNum);
          }
        }
      }
    }
  }

  formatMetaData() {
    // 没有 replicas 参数，添加一个 cluster 的机房数组。
    if (!this.resource.metaData) {
      this.resource.metaData = '{}';
    }
    const metaData = JSON.parse(this.resource.metaData);
    const clusters = [];
    for (const clu of this.clusters) {
      const clusterMeta = this.clusterMetas[clu.name];
      if (clusterMeta && clusterMeta.checked && clusterMeta.value) {
        clusters.push(clu.name);
      }
    }
    metaData.clusters = clusters;
    metaData.resources = this.resourceLimitComponent.getValue();
    this.resource.metaData = JSON.stringify(metaData);
  }
}

