import { App } from './app';

export class ConfigMap {
  id: number;
  name: string;
  metaData: string;
  metaDataObj: {};
  user: string;
  appId: number;
  description: string;
  deleted: boolean;
  createTime: Date;
  app: App;
  order: number;
}
