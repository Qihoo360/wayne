import { Secret } from './secret';
import { PublishStatus } from './publish-status';

export class SecretTpl {
  id: number;
  name: string;
  secretId: number;
  template: string;
  description: string;
  deleted: boolean;
  user: string;
  createTime: Date;
  updateTime: Date;
  secret: Secret;
  status: PublishStatus[];
  metaData: string;
  clusters: string[];
}

