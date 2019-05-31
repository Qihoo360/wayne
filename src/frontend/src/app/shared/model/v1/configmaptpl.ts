import { ConfigMap } from './configmap';
import { PublishStatus } from './publish-status';

export class ConfigMapTpl {
  id: number;
  name: string;
  configMapId: number;
  template: string;
  description: string;
  deleted: boolean;
  user: string;
  metaData: string;
  createTime: Date;
  updateTime?: Date;
  configMap: ConfigMap;
  clusters: string[];
  status: PublishStatus[];
}
