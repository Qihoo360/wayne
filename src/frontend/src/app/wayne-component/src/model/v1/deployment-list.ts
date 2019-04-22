/* Do not change, this code is generated from Golang structs */


export class TypeMeta {
  kind: string;

  constructor(init?: TypeMeta) {
    if (!init) { return; }
    if (init.kind) { this.kind = init.kind; }
  }


  static emptyObject(): TypeMeta {
    const result = new TypeMeta();
    return result;
  }

}

export class Time {
  Time: Date;

  constructor(init?: Time) {
    if (!init) { return; }
    if (init.Time) { this.Time = new Date(init.Time as any); }
  }


  static emptyObject(): Time {
    const result = new Time();
    result.Time = null;
    return result;
  }

}

export class ObjectMeta {
  name: string;
  namespace: string;
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
  creationTimestamp: Time;

  constructor(init?: ObjectMeta) {
    if (!init) { return; }
    if (init.name) { this.name = init.name; }
    if (init.namespace) { this.namespace = init.namespace; }
    if (init.labels) { this.labels = init.labels; }
    if (init.annotations) { this.annotations = init.annotations; }
    if (init.creationTimestamp) { this.creationTimestamp = init.creationTimestamp; }
  }


  static emptyObject(): ObjectMeta {
    const result = new ObjectMeta();
    result.labels = null;
    result.annotations = null;
    result.creationTimestamp = Time.emptyObject();
    return result;
  }

}

export class Event {
  objectMeta: ObjectMeta;
  typeMeta: TypeMeta;
  message: string;
  sourceComponent: string;
  name: string;
  object: string;
  count: number;
  firstSeen: Time;
  lastSeen: Time;
  reason: string;
  type: string;

  constructor(init?: Event) {
    if (!init) { return; }
    if (init.objectMeta) { this.objectMeta = init.objectMeta; }
    if (init.typeMeta) { this.typeMeta = init.typeMeta; }
    if (init.message) { this.message = init.message; }
    if (init.sourceComponent) { this.sourceComponent = init.sourceComponent; }
    if (init.name) { this.name = init.name; }
    if (init.object) { this.object = init.object; }
    if (init.count) { this.count = init.count; }
    if (init.firstSeen) { this.firstSeen = init.firstSeen; }
    if (init.lastSeen) { this.lastSeen = init.lastSeen; }
    if (init.reason) { this.reason = init.reason; }
    if (init.type) { this.type = init.type; }
  }


  static emptyObject(): Event {
    const result = new Event();
    result.objectMeta = ObjectMeta.emptyObject();
    result.typeMeta = TypeMeta.emptyObject();
    result.firstSeen = Time.emptyObject();
    result.lastSeen = Time.emptyObject();
    return result;
  }

}

export class PodInfo {
  current: number;
  desired: number;
  running: number;
  pending: number;
  failed: number;
  succeeded: number;
  warnings: Event[];

  constructor(init?: PodInfo) {
    if (!init) { return; }
    if (init.current) { this.current = init.current; }
    if (init.desired) { this.desired = init.desired; }
    if (init.running) { this.running = init.running; }
    if (init.pending) { this.pending = init.pending; }
    if (init.failed) { this.failed = init.failed; }
    if (init.succeeded) { this.succeeded = init.succeeded; }
    if (init.warnings) { this.warnings = init.warnings; }
  }


  static emptyObject(): PodInfo {
    const result = new PodInfo();
    result.warnings = [];
    return result;
  }

}

export class DeploymentList {
  objectMeta: ObjectMeta;
  pods: PodInfo;
  containers: string[];

  constructor(init?: DeploymentList) {
    if (!init) { return; }
    if (init.objectMeta) { this.objectMeta = init.objectMeta; }
    if (init.pods) { this.pods = init.pods; }
    if (init.containers) { this.containers = init.containers; }
  }


  static emptyObject(): DeploymentList {
    const result = new DeploymentList();
    result.objectMeta = ObjectMeta.emptyObject();
    result.pods = PodInfo.emptyObject();
    result.containers = [];
    return result;
  }

}
