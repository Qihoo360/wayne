export class ContainerStatus {
  name: string;
  restartCount: number;
}

export class Pod {
  name: string;
  namespace: string;
  containerStatus: ContainerStatus[];
  podIp: string;
  state: string;
  startTime: Date;
}
