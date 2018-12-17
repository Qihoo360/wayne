/* Do not change, this code is generated from Golang structs */


export class NamespaceStatus {
    phase: string;

    constructor(init?: NamespaceStatus) {
        if (!init) { return ; }
        if (init.phase) { this.phase = init.phase; }
    }


    static emptyObject(): NamespaceStatus {
        const result = new NamespaceStatus();
        result.phase = '';
        return result;
    }

}
export class NamespaceSpec {
    finalizers: string[];

    constructor(init?: NamespaceSpec) {
        if (!init) { return ; }
        if (init.finalizers) { this.finalizers = init.finalizers; }
    }


    static emptyObject(): NamespaceSpec {
        const result = new NamespaceSpec();
        result.finalizers = [];
        return result;
    }

}
export class StatusCause {
    reason: string;
    message: string;
    field: string;

    constructor(init?: StatusCause) {
        if (!init) { return ; }
        if (init.reason) { this.reason = init.reason; }
        if (init.message) { this.message = init.message; }
        if (init.field) { this.field = init.field; }
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
        if (!init) { return ; }
        if (init.name) { this.name = init.name; }
        if (init.group) { this.group = init.group; }
        if (init.kind) { this.kind = init.kind; }
        if (init.uid) { this.uid = init.uid; }
        if (init.causes) { this.causes = init.causes; }
        if (init.retryAfterSeconds) { this.retryAfterSeconds = init.retryAfterSeconds; }
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
        if (!init) { return ; }
        if (init.selfLink) { this.selfLink = init.selfLink; }
        if (init.resourceVersion) { this.resourceVersion = init.resourceVersion; }
        if (init.continue) { this.continue = init.continue; }
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
        if (!init) { return ; }
        if (init.kind) { this.kind = init.kind; }
        if (init.apiVersion) { this.apiVersion = init.apiVersion; }
        if (init.metadata) { this.metadata = init.metadata; }
        if (init.status) { this.status = init.status; }
        if (init.message)  { this.message = init.message; }
        if (init.reason)  { this.reason = init.reason; }
        if (init.details)  { this.details = init.details; }
        if (init.code)  { this.code = init.code; }
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
        if (!init) { return ; }
        if (init.name) { this.name = init.name; }
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
        if (!init) { return ; }
        if (init.pending) { this.pending = init.pending; }
        if (init.result) { this.result = init.result; }
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
        if (!init) { return ; }
        if (init.apiVersion) { this.apiVersion = init.apiVersion; }
        if (init.kind) { this.kind = init.kind; }
        if (init.name) { this.name = init.name; }
        if (init.uid) { this.uid = init.uid; }
        if (init.controller) { this.controller = init.controller; }
        if (init.blockOwnerDeletion) { this.blockOwnerDeletion = init.blockOwnerDeletion; }
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


export class Time {
    Time: Date;

    constructor(init?: Time) {
        if (!init) { return ; }
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
        if (!init) { return ; }
        if (init.name) { this.name = init.name; }
        if (init.generateName) { this.generateName = init.generateName; }
        if (init.namespace) { this.namespace = init.namespace; }
        if (init.selfLink) { this.selfLink = init.selfLink; }
        if (init.uid) { this.uid = init.uid; }
        if (init.resourceVersion) { this.resourceVersion = init.resourceVersion; }
        if (init.generation) { this.generation = init.generation; }
        if (init.creationTimestamp) { this.creationTimestamp = init.creationTimestamp; }
        if (init.deletionTimestamp) { this.deletionTimestamp = init.deletionTimestamp; }
        if (init.deletionGracePeriodSeconds) { this.deletionGracePeriodSeconds = init.deletionGracePeriodSeconds; }
        if (init.labels) { this.labels = init.labels; }
        if (init.annotations) { this.annotations = init.annotations; }
        if (init.ownerReferences) { this.ownerReferences = init.ownerReferences; }
        if (init.initializers) { this.initializers = init.initializers; }
        if (init.finalizers) { this.finalizers = init.finalizers; }
        if (init.clusterName) { this.clusterName = init.clusterName; }
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
export class KubeNamespace {
    kind: string;
    apiVersion: string;
    metadata: ObjectMeta;
    spec: NamespaceSpec;
    status: NamespaceStatus;

    constructor(init?: KubeNamespace) {
        if (!init) { return ; }
        if (init.kind) { this.kind = init.kind; }
        if (init.apiVersion) { this.apiVersion = init.apiVersion; }
        if (init.metadata) { this.metadata = init.metadata; }
        if (init.spec) { this.spec = init.spec; }
        if (init.status) { this.status = init.status; }
    }


    static emptyObject(): KubeNamespace {
        const result = new KubeNamespace();
        result.kind = '';
        result.apiVersion = '';
        result.metadata = ObjectMeta.emptyObject();
        result.spec = NamespaceSpec.emptyObject();
        result.status = NamespaceStatus.emptyObject();
        return result;
    }

}
