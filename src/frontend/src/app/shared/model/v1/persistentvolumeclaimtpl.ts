import { PublishStatus } from './publish-status';

export class PersistentVolumeClaimTpl {
  id: number;
  name: string;
  template: string;
  persistentVolumeClaimId: number;
  metaData: string;
  description: string;
  deleted: boolean;
  user: string;
  createTime: Date;
  updateTime: Date;
  clusters: string[];
  status: PublishStatus[];
}

