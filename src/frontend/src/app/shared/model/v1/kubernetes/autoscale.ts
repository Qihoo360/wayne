/* Do not change, this code is generated from Golang structs */

export class Time {
  Time: Date;

  constructor(init?: Time) {
    if (!init) {
      return ;
    }
    if (init.Time) {
      this.Time = new Date(init.Time as any);
    }
  }


  static emptyObject(): Time {
    const result = new Time();
    result.Time = null;
    return result;
  }

}

export class HorizontalPodAutoscalerStatus {
  observedGeneration?: number;
  lastScaleTime?: Time;
  currentReplicas: number;
  desiredReplicas: number;
  currentCPUUtilizationPercentage?: number;

  constructor(init?: HorizontalPodAutoscalerStatus) {
    if (!init) {
      return ;
    }
    if (init.observedGeneration) {
      this.observedGeneration = init.observedGeneration;
    }
    if (init.lastScaleTime) {
      this.lastScaleTime = init.lastScaleTime;
    }
    if (init.currentReplicas) {
      this.currentReplicas = init.currentReplicas;
    }
    if (init.desiredReplicas) {
      this.desiredReplicas = init.desiredReplicas;
    }
    if (init.currentCPUUtilizationPercentage) {
      this.currentCPUUtilizationPercentage = init.currentCPUUtilizationPercentage;
    }
  }


  static emptyObject(): HorizontalPodAutoscalerStatus {
    const result = new HorizontalPodAutoscalerStatus();
    result.observedGeneration = 0;
    result.lastScaleTime = Time.emptyObject();
    result.currentReplicas = 0;
    result.desiredReplicas = 0;
    result.currentCPUUtilizationPercentage = 0;
    return result;
  }

}
export class CrossVersionObjectReference {
  kind: string;
  name: string;
  apiVersion: string;

  constructor(init?: CrossVersionObjectReference) {
    if (!init) {
      return ;
    }
    if (init.kind) {
      this.kind = init.kind;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.apiVersion) {
      this.apiVersion = init.apiVersion;
    }
  }


  static emptyObject(): CrossVersionObjectReference {
    const result = new CrossVersionObjectReference();
    result.kind = '';
    result.name = '';
    result.apiVersion = '';
    return result;
  }

}
export class HorizontalPodAutoscalerSpec {
  scaleTargetRef: CrossVersionObjectReference;
  minReplicas?: number;
  maxReplicas: number;
  targetCPUUtilizationPercentage?: number;

  constructor(init?: HorizontalPodAutoscalerSpec) {
    if (!init) {
      return ;
    }
    if (init.scaleTargetRef) {
      this.scaleTargetRef = init.scaleTargetRef;
    }
    if (init.minReplicas) {
      this.minReplicas = init.minReplicas;
    }
    if (init.maxReplicas) {
      this.maxReplicas = init.maxReplicas;
    }
    if (init.targetCPUUtilizationPercentage) {
      this.targetCPUUtilizationPercentage = init.targetCPUUtilizationPercentage;
    }
  }


  static emptyObject(): HorizontalPodAutoscalerSpec {
    const result = new HorizontalPodAutoscalerSpec();
    result.scaleTargetRef = CrossVersionObjectReference.emptyObject();
    result.minReplicas = 0;
    result.maxReplicas = 0;
    result.targetCPUUtilizationPercentage = 0;
    return result;
  }

}
export class StatusCause {
  reason: string;
  message: string;
  field: string;

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


  static emptyObject(): StatusCause {
    const result = new StatusCause();
    result.reason = '';
    result.message = '';
    result.field = '';
    return result;
  }

}
export class StatusDetails {
  name: string;
  group: string;
  kind: string;
  uid: string;
  causes: StatusCause[];
  retryAfterSeconds: number;

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

}
export class ListMeta {
  selfLink: string;
  resourceVersion: string;
  continue: string;

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


  static emptyObject(): ListMeta {
    const result = new ListMeta();
    result.selfLink = '';
    result.resourceVersion = '';
    result.continue = '';
    return result;
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

}
export class Initializer {
  name: string;

  constructor(init?: Initializer) {
    if (!init) {
      return ;
    }
    if (init.name) {
      this.name = init.name;
    }
  }


  static emptyObject(): Initializer {
    const result = new Initializer();
    result.name = '';
    return result;
  }

}
export class Initializers {
  pending: Initializer[];
  result?: Status;

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


  static emptyObject(): Initializers {
    const result = new Initializers();
    result.pending = [];
    result.result = Status.emptyObject();
    return result;
  }

}
export class OwnerReference {
  apiVersion: string;
  kind: string;
  name: string;
  uid: string;
  controller?: boolean;
  blockOwnerDeletion?: boolean;

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
    if (init.blockOwnerDeletion) {
      this.blockOwnerDeletion = init.blockOwnerDeletion;
    }
  }


  static emptyObject(): OwnerReference {
    const result = new OwnerReference();
    result.apiVersion = '';
    result.kind = '';
    result.name = '';
    result.uid = '';
    result.controller = false;
    result.blockOwnerDeletion = false;
    return result;
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
  deletionTimestamp?: Time;
  deletionGracePeriodSeconds?: number;
  labels?: {[key: string]: string};
  annotations?: {[key: string]: string};
  ownerReferences: OwnerReference[];
  initializers?: Initializers;
  finalizers: string[];
  clusterName: string;

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
    if (init.deletionTimestamp) {
      this.deletionTimestamp = init.deletionTimestamp;
    }
    if (init.deletionGracePeriodSeconds) {
      this.deletionGracePeriodSeconds = init.deletionGracePeriodSeconds;
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
    result.deletionTimestamp = Time.emptyObject();
    result.deletionGracePeriodSeconds = 0;
    result.labels = null;
    result.annotations = null;
    result.ownerReferences = [];
    result.initializers = Initializers.emptyObject();
    result.finalizers = [];
    result.clusterName = '';
    return result;
  }

}
export class HorizontalPodAutoscaler {
  kind: string;
  apiVersion: string;
  metadata: ObjectMeta;
  spec: HorizontalPodAutoscalerSpec;
  status: HorizontalPodAutoscalerStatus;

  constructor(init?: HorizontalPodAutoscaler) {
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


  static emptyObject(): HorizontalPodAutoscaler {
    const result = new HorizontalPodAutoscaler();
    result.kind = '';
    result.apiVersion = '';
    result.metadata = ObjectMeta.emptyObject();
    result.spec = HorizontalPodAutoscalerSpec.emptyObject();
    result.status = HorizontalPodAutoscalerStatus.emptyObject();
    return result;
  }

}
