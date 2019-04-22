import { App } from './app';

export class Secret {
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
