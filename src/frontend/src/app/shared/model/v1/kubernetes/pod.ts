export class ContainerStatus {
  name: string;
  restartCount: number;
  //[ContainerStatus:]
  //[end]
}

export class Pod {
  name: string;
  namespace: string;
  containerStatus: ContainerStatus[];
  podIp: string;
  state: string;
  startTime: Date;
  //[Pod:]
  //[end]
}
