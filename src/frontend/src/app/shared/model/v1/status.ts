import { PublishStatus } from './publish-status';
import { TemplateState } from '../../shared.const';
import { Event } from './event';

export class TemplateStatus {
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
    const dStatus = new TemplateStatus();
    dStatus.id = state.id;
    dStatus.deploymentId = state.resourceId;
    dStatus.templateId = state.templateId;
    dStatus.cluster = state.cluster;
    return dStatus;
  }
}
