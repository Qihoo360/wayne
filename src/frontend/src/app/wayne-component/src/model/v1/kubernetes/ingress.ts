/* Do not change, this code is generated from Golang structs */


export class LoadBalancerIngress {
  ip: string;
  hostname: string;

  static emptyObject(): LoadBalancerIngress {
    const result = new LoadBalancerIngress();
    result.ip = '';
    result.hostname = '';
    return result;
  }
  constructor(init?: LoadBalancerIngress) {
    if (!init) {
      return ;
    }
    if (init.ip) {
      this.ip = init.ip;
    }
    if (init.hostname) {
      this.hostname = init.hostname;
    }
  }
}
export class LoadBalancerStatus {
  ingress: LoadBalancerIngress[];

  static emptyObject(): LoadBalancerStatus {
    const result = new LoadBalancerStatus();
    result.ingress = [];
    return result;
  }
  constructor(init?: LoadBalancerStatus) {
    if (!init) {
      return ;
    }
    if (init.ingress) {
      this.ingress = init.ingress;
    }
  }

}
export class IngressStatus {
  loadBalancer: LoadBalancerStatus;

  static emptyObject(): IngressStatus {
    const result = new IngressStatus();
    result.loadBalancer = LoadBalancerStatus.emptyObject();
    return result;
  }

  constructor(init?: IngressStatus) {
    if (!init) {
      return ;
    }
    if (init.loadBalancer) {
      this.loadBalancer = init.loadBalancer;
    }
  }
}

export class IngressPath {
  backend: IngressBackend;
  path: string;
}

export  class IngressHttp {
  paths: IngressPath[];
}

export class IngressRule {
  host: string;
  http: IngressHttp;

  static emptyObject(): IngressRule {
    const result = new IngressRule();
    result.host = '';
    result.http = new IngressHttp();
    return result;
  }

  constructor(init?: IngressRule) {
    if (!init) {
      return ;
    }
    if (init.host) {
      this.host = init.host;
    }
  }

}
export class IngressTLS {
  hosts: string[];
  secretName: string;

  static emptyObject(): IngressTLS {
    const result = new IngressTLS();
    result.hosts = [];
    result.secretName = '';
    return result;
  }
  constructor(init?: IngressTLS) {
    if (!init) {
      return ;
    }
    if (init.hosts) {
      this.hosts = init.hosts;
    }
    if (init.secretName) {
      this.secretName = init.secretName;
    }
  }

}
export class IntOrString {
  Type: number;
  IntVal: number;
  StrVal: string;


  static emptyObject(): IntOrString {
    const result = new IntOrString();
    result.Type = 0;
    result.IntVal = 0;
    result.StrVal = '';
    return result;
  }
  constructor(init?: IntOrString) {
    if (!init) {
      return ;
    }
    if (init.Type) {
      this.Type = init.Type;
    }
    if (init.IntVal) {
      this.IntVal = init.IntVal;
    }
    if (init.StrVal) {
      this.StrVal = init.StrVal;
    }
  }

}
export class IngressBackend {
  serviceName: string;
  servicePort: number;


  static emptyObject(): IngressBackend {
    const result = new IngressBackend();
    result.serviceName = '';
    result.servicePort = 0;
    return result;
  }
  constructor(init?: IngressBackend) {
    if (!init) {
      return ;
    }
    if (init.serviceName) {
      this.serviceName = init.serviceName;
    }
    if (init.servicePort) {
      this.servicePort = init.servicePort;
    }
  }

}
export class IngressSpec {
  backend?: IngressBackend;
  tls: IngressTLS[];
  rules: IngressRule[];

  static emptyObject(): IngressSpec {
    const result = new IngressSpec();
    result.backend = IngressBackend.emptyObject();
    result.tls = [];
    result.rules = [];
    return result;
  }
  constructor(init?: IngressSpec) {
    if (!init) {
      return ;
    }
    if (init.backend) {
      this.backend = init.backend;
    }
    if (init.tls) {
      this.tls = init.tls;
    }
    if (init.rules) {
      this.rules = init.rules;
    }
  }

}
export class StatusCause {
  reason: string;
  message: string;
  field: string;

  static emptyObject(): StatusCause {
    const result = new StatusCause();
    result.reason = '';
    result.message = '';
    result.field = '';
    return result;
  }
  constructor(init?: StatusCause) {
    if (!init) {
      return ;
    }
    if (init.reason) {
      this.reason = init.reason;
    }
    if (init.message) {
      this.message = init.message;
    }
    if (init.field) {
      this.field = init.field;
    }
  }

}
export class StatusDetails {
  name: string;
  group: string;
  kind: string;
  uid: string;
  causes: StatusCause[];
  retryAfterSeconds: number;



  static emptyObject(): StatusDetails {
    const result = new StatusDetails();
    result.name = '';
    result.group = '';
    result.kind = '';
    result.uid = '';
    result.causes = [];
    result.retryAfterSeconds = 0;
    return result;
  }
  constructor(init?: StatusDetails) {
    if (!init) {
      return ;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.group) {
      this.group = init.group;
    }
    if (init.kind) {
      this.kind = init.kind;
    }
    if (init.uid) {
      this.uid = init.uid;
    }
    if (init.causes) {
      this.causes = init.causes;
    }
    if (init.retryAfterSeconds) {
      this.retryAfterSeconds = init.retryAfterSeconds;
    }
  }

}
export class ListMeta {
  selfLink: string;
  resourceVersion: string;
  continue: string;

  static emptyObject(): ListMeta {
    const result = new ListMeta();
    result.selfLink = '';
    result.resourceVersion = '';
    result.continue = '';
    return result;
  }
  constructor(init?: ListMeta) {
    if (!init) {
      return ;
    }
    if (init.selfLink) {
      this.selfLink = init.selfLink;
    }
    if (init.resourceVersion) {
      this.resourceVersion = init.resourceVersion;
    }
    if (init.continue) {
      this.continue = init.continue;
    }
  }

}
export class Status {
  kind: string;
  apiVersion: string;
  metadata: ListMeta;
  status: string;
  message: string;
  reason: string;
  details?: StatusDetails;
  code: number;

  static emptyObject(): Status {
    const result = new Status();
    result.kind = '';
    result.apiVersion = '';
    result.metadata = ListMeta.emptyObject();
    result.status = '';
    result.message = '';
    result.reason = '';
    result.details = StatusDetails.emptyObject();
    result.code = 0;
    return result;
  }
  constructor(init?: Status) {
    if (!init) {
      return ;
    }
    if (init.kind) {
      this.kind = init.kind;
    }
    if (init.apiVersion) {
      this.apiVersion = init.apiVersion;
    }
    if (init.metadata) {
      this.metadata = init.metadata;
    }
    if (init.status) {
      this.status = init.status;
    }
    if (init.message) {
      this.message = init.message;
    }
    if (init.reason) {
      this.reason = init.reason;
    }
    if (init.details) {
      this.details = init.details;
    }
    if (init.code) {
      this.code = init.code;
    }
  }

}
export class Initializer {
  name: string;


  static emptyObject(): Initializer {
    const result = new Initializer();
    result.name = '';
    return result;
  }
  constructor(init?: Initializer) {
    if (!init) {
      return ;
    }
    if (init.name) {
      this.name = init.name;
    }
  }

}
export class Initializers {
  pending: Initializer[];
  result?: Status;

  static emptyObject(): Initializers {
    const result = new Initializers();
    result.pending = [];
    result.result = Status.emptyObject();
    return result;
  }
  constructor(init?: Initializers) {
    if (!init) {
      return ;
    }
    if (init.pending) {
      this.pending = init.pending;
    }
    if (init.result) {
      this.result = init.result;
    }
  }

}
export class OwnerReference {
  apiVersion: string;
  kind: string;
  name: string;
  uid: string;
  controller?: boolean;
  blockOwnerDeconstion?: boolean;


  static emptyObject(): OwnerReference {
    const result = new OwnerReference();
    result.apiVersion = '';
    result.kind = '';
    result.name = '';
    result.uid = '';
    result.controller = false;
    result.blockOwnerDeconstion = false;
    return result;
  }
  constructor(init?: OwnerReference) {
    if (!init) {
      return ;
    }
    if (init.apiVersion) {
      this.apiVersion = init.apiVersion;
    }
    if (init.kind) {
      this.kind = init.kind;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.uid) {
      this.uid = init.uid;
    }
    if (init.controller) {
      this.controller = init.controller;
    }
    if (init.blockOwnerDeconstion) {
      this.blockOwnerDeconstion = init.blockOwnerDeconstion;
    }
  }

}


export class Time {
  Time: Date;

  static emptyObject(): Time {
    const result = new Time();
    result.Time = null;
    return result;
  }
  constructor(init?: Time) {
    if (!init) {
      return ;
    }
    if (init.Time) {
      this.Time = new Date(init.Time as any);
    }
  }

}
export class ObjectMeta {
  name: string;
  generateName: string;
  namespace: string;
  selfLink: string;
  uid: string;
  resourceVersion: string;
  generation: number;
  creationTimestamp: Time;
  deconstionTimestamp?: Time;
  deconstionGracePeriodSeconds?: number;
  labels?: {[key: string]: string};
  annotations?: {[key: string]: string};
  ownerReferences: OwnerReference[];
  initializers?: Initializers;
  finalizers: string[];
  clusterName: string;
  static emptyObject(): ObjectMeta {
    const result = new ObjectMeta();
    result.name = '';
    result.generateName = '';
    result.namespace = '';
    result.selfLink = '';
    result.uid = '';
    result.resourceVersion = '';
    result.generation = 0;
    result.creationTimestamp = Time.emptyObject();
    result.deconstionTimestamp = Time.emptyObject();
    result.deconstionGracePeriodSeconds = 0;
    result.labels = null;
    result.annotations = null;
    result.ownerReferences = [];
    result.initializers = Initializers.emptyObject();
    result.finalizers = [];
    result.clusterName = '';
    return result;
  }
  constructor(init?: ObjectMeta) {
    if (!init) {
      return ;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.generateName) {
      this.generateName = init.generateName;
    }
    if (init.namespace) {
      this.namespace = init.namespace;
    }
    if (init.selfLink) {
      this.selfLink = init.selfLink;
    }
    if (init.uid) {
      this.uid = init.uid;
    }
    if (init.resourceVersion) {
      this.resourceVersion = init.resourceVersion;
    }
    if (init.generation) {
      this.generation = init.generation;
    }
    if (init.creationTimestamp) {
      this.creationTimestamp = init.creationTimestamp;
    }
    if (init.deconstionTimestamp) {
      this.deconstionTimestamp = init.deconstionTimestamp;
    }
    if (init.deconstionGracePeriodSeconds) {
      this.deconstionGracePeriodSeconds = init.deconstionGracePeriodSeconds;
    }
    if (init.labels) {
      this.labels = init.labels;
    }
    if (init.annotations) {
      this.annotations = init.annotations;
    }
    if (init.ownerReferences) {
      this.ownerReferences = init.ownerReferences;
    }
    if (init.initializers) {
      this.initializers = init.initializers;
    }
    if (init.finalizers) {
      this.finalizers = init.finalizers;
    }
    if (init.clusterName) {
      this.clusterName = init.clusterName;
    }
  }

}
export class KubeIngress {
  kind: string;
  apiVersion: string;
  metadata: ObjectMeta;
  spec: IngressSpec;
  status: IngressStatus;

  static emptyObject(): KubeIngress {
    const result = new KubeIngress();
    result.kind = '';
    result.apiVersion = '';
    result.metadata = ObjectMeta.emptyObject();
    result.spec = IngressSpec.emptyObject();
    result.status = IngressStatus.emptyObject();
    return result;
  }
  constructor(init?: KubeIngress) {
    if (!init) {
      return ;
    }
    if (init.kind) {
      this.kind = init.kind;
    }
    if (init.apiVersion) {
      this.apiVersion = init.apiVersion;
    }
    if (init.metadata) {
      this.metadata = init.metadata;
    }
    if (init.spec) {
      this.spec = init.spec;
    }
    if (init.status) {
      this.status = init.status;
    }
  }

}
