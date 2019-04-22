import { Ingress } from './ingress';
import { PublishStatus } from './publish-status';

export class IngressTpl {
  id: number;
  name: string;
  ingressId: number;
  template: string;
  description: string;
  deleted: boolean;
  user: string;
  createTime: Date;
  ingress: Ingress;

  ports: string;
  status: PublishStatus[];
}
