export class NamespaceMetaData {
  clusterMeta: { [key: string]: ClusterMeta };
  imagePullSecrets: LocalObjectReference[];
  env: EnvVar[];
  serviceAnnotations: {[key: string]: string};
  ingressAnnotations: {[key: string]: string};

  constructor() {
    this.imagePullSecrets = [];
    this.env = [];
    this.clusterMeta = {};
    this.ingressAnnotations = {};
    this.serviceAnnotations = {};
  }
}

export class Namespace {
  id: number;
  name: string;
  kubeNamespace: string;
  deleted: boolean;
  metaData: string;
  metaDataObj: NamespaceMetaData;
  user: string;
  createTime: Date;
  updateTime: Date;

  constructor() {
    this.metaDataObj = new NamespaceMetaData();
  }

  static ParseNamespaceMetaData(obj: any) {
    const namespaceMetaData = new NamespaceMetaData();
    const metaDataObj = JSON.parse(obj);
    Object.getOwnPropertyNames(metaDataObj).forEach(name => {
      namespaceMetaData[name] = metaDataObj[name];
    });
    return namespaceMetaData;
  }

  static emptyObject(): Namespace {
    const result = new Namespace();
    result.createTime = null;
    result.updateTime = null;
    return result;
  }
}

export class ResourcesLimit {
  cpu: number;
  memory: number;

  constructor() {
    this.cpu = 0;
    this.memory = 0;
  }
}

export class ClusterMeta {
  resourcesLimit: ResourcesLimit;

  constructor() {
    this.resourcesLimit = new ResourcesLimit();
  }
}

export class EnvVar {
  name: string;
  value: string;
}

export class LocalObjectReference {
  name: string;

  constructor() {

  }
}
