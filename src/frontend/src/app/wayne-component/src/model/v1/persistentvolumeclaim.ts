import { App } from './app';

export class PersistentVolumeClaim {
  id: number;
  name: string;
  metaData: string;
  metaDataObj: {};
  appId: number;
  app: App;
  description: string;
  deleted: boolean;
  user: string;
  createTime: Date;
  updateTime: Date;
  order: number;
}

export class PersistentVolumeClaimLoginInfo {
  user: string;
  password: string;
  server: string;
  port: string;
}

export class PersistentVolumeClaimFileSystemStatus {
  msg: string;
  status: string[];
  rbdImage: string;
  imageType: string;
}

export class PersistentVolumeClaimSnap {
  id: number;
  name: string;
  size: number;
}
