import { Cronjob } from './cronjob';
import { TemplateState } from '../../shared.const';
import { PublishStatus } from './publish-status';

export class CronjobTpl {
  id: number;
  name: string;
  cronjobId: number;
  template: string;
  schedule: string;
  description: string;
  deleted: boolean;
  user: string;
  metaData: string;
  createTime: Date;
  cronjob: Cronjob;
  clusters: string[];
  status: CronjobStatus[];
  containerVersions: string[];
}

export class CronjobStatus {
  id: number;
  cronjobId: number;
  templateId: number;
  cluster: string;
  state: TemplateState;
  current: number;
  desired: number;
  warnings: Event[];
  errNum: number;

  kubeObj: any;

  constructor() {
    this.errNum = 0;
  }

  static fromPublishStatus(state: PublishStatus) {
    const dStatus = new CronjobStatus();
    dStatus.id = state.id;
    dStatus.cronjobId = state.resourceId;
    dStatus.templateId = state.templateId;
    dStatus.cluster = state.cluster;
    return dStatus;
  }
}
