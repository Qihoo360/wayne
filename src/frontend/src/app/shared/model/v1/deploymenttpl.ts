import { Deployment } from './deployment';
import { TemplateState } from '../../shared.const';
import { PublishStatus } from './publish-status';

export class DeploymentTpl {
  id: number;
  name: string;
  deploymentId: number;
  template: string;
  description: string;
  deleted: boolean;
  user: string;
  createTime: Date;
  updateTime?: Date;
  deployment: Deployment;

  status: DeploymentStatus[];
  containerVersions: string[];
}

export class DeploymentStatus {
  id: number;
  deploymentId: number;
  templateId: number;
  cluster: string;
  state: TemplateState;
  current: number;
  desired: number;
  warnings: Event[];
  errNum: number;

  constructor() {
    this.errNum = 0;
  }

  static fromPublishStatus(state: PublishStatus) {
    const dStatus = new DeploymentStatus();
    dStatus.id = state.id;
    dStatus.deploymentId = state.resourceId;
    dStatus.templateId = state.templateId;
    dStatus.cluster = state.cluster;
    return dStatus;
  }
}

export class Event {
  message: string;
  sourceComponent: string;
  Name: string;
  object: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  reason: string;
  type: string;
}
