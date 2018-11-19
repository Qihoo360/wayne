export class Namespace {
  constructor() {
    this.metaDataObj = new NamespaceMetaData();
  }

  static ParseNamespaceMetaData(obj: any) {
    let namespaceMetaData = new NamespaceMetaData();
    const metaDataObj = JSON.parse(obj);
    Object.getOwnPropertyNames(metaDataObj).forEach(name => {
      namespaceMetaData[name] = metaDataObj[name]
    });
    return namespaceMetaData;
  }

  static emptyObject(): Namespace {
    let result = new Namespace();
    result.createTime = null;
    result.updateTime = null;
    return result;
  }

  id: number;
  name: string;
  deleted: boolean;
  metaData: string;
  metaDataObj: NamespaceMetaData;
  user: string;
  createTime: Date;
  updateTime: Date;
}

export class ResourcesLimit {
  cpu: number;
  memory: number;

  //[NamespaceMetaDataResources:]
  constructor() {
    this.cpu = 0;
    this.memory = 0;
  }

  //[end]
}

export class ClusterMeta {
  resourcesLimit: ResourcesLimit;

  constructor() {
    this.resourcesLimit = new ResourcesLimit();
  }
}

export class NamespaceMetaData {
  namespace: string;
  clusterMeta: { [key: string]: ClusterMeta };
  imagePullSecrets: LocalObjectReference[];
  env: EnvVar[];

  constructor() {
    this.imagePullSecrets = [];
    this.env = [];
  }

  //[NamespaceMetaData:]


  //[end]
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
