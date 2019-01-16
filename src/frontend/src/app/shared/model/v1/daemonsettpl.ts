import { DaemonSet } from './daemonset';
import { TemplateStatus } from './status';


export class DaemonSetTemplate {
  id: number;
  name: string;
  template: string;
  daemonSet?: DaemonSet;
  description: string;
  createTime: Date;
  updateTime: Date;
  user: string;
  deleted: boolean;
  daemonSetId: number;
  status: TemplateStatus[];
  containerVersions: string[];

  constructor(init?: DaemonSetTemplate) {
    if (!init) {  return; }
    if (init.id) { this.id = init.id; }
    if (init.name) { this.name = init.name; }
    if (init.template) { this.template = init.template; }
    if (init.daemonSet) { this.daemonSet = init.daemonSet; }
    if (init.description) { this.description = init.description; }
    if (init.createTime) {
      this.createTime = new Date(init.createTime as any);
    }
    if (init.updateTime) {
      this.updateTime = new Date(init.updateTime as any);
    }
    if (init.user) { this.user = init.user; }
    if (init.deleted) { this.deleted = init.deleted; }
    if (init.daemonSetId) { this.daemonSetId = init.daemonSetId; }
    if (init.status) { this.status = init.status; }
  }


  static emptyObject(): DaemonSetTemplate {
    const result = new DaemonSetTemplate();
    result.daemonSet = DaemonSet.emptyObject();
    result.createTime = null;
    result.updateTime = null;
    result.status = [];
    return result;
  }

}
