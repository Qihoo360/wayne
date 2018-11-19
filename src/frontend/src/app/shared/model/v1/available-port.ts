export class AvailablePort {
  id: number;
  type: number;
  from: number;
  to: number;
  metaData: string;
  user: string;
  deleted: boolean;
  createTime: Date;
}

export class PortType {
  id: number;
  name: string;
}
