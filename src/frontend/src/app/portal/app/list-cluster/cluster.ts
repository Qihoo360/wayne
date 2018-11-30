class Resource {
  limit: {
    cpu: number;
    memory: number;
  };
}

export class Cluster {
  cluster: string;
  resource: {
    limit: Resource;
    usage: Resource;
  };
}
