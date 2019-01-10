import { PublishStatus } from './publish-status';
import { Autoscale } from './autoscale';

export class AutoscaleTpl {
  id: number;
  name: string;
  hpaId: number;
  template: string;
  description: string;
  deleted: boolean;
  user: string;
  createTime: Date;
  hpa: Autoscale;
  status: PublishStatus[];
}
