/* Do not change, this code is generated from Golang structs */
import { Node } from './node-list';

export class Time {
  Time: Date;

  constructor(init?: Time) {
    if (!init) {  return; }
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

export interface NodeSummary {
  cpuSummary: Object;
  memorySummary: Object;
  nodeSummary: Object;
  node: Node[];
}


export class AttachedVolume {
  name: string;
  devicePath: string;

  constructor(init?: AttachedVolume) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.devicePath) { this.devicePath = init.devicePath; }
  }


  static emptyObject(): AttachedVolume {
    const result = new AttachedVolume();
    return result;
  }

}

export class ContainerImage {
  names: string[];
  sizeBytes: number;

  constructor(init?: ContainerImage) {
    if (!init) {  return; }
    if (init.names) { this.names = init.names; }
    if (init.sizeBytes) { this.sizeBytes = init.sizeBytes; }
  }


  static emptyObject(): ContainerImage {
    const result = new ContainerImage();
    result.names = [];
    return result;
  }

}

export class NodeSystemInfo {
  machineID: string;
  systemUUID: string;
  bootID: string;
  kernelVersion: string;
  osImage: string;
  containerRuntimeVersion: string;
  kubeletVersion: string;
  kubeProxyVersion: string;
  operatingSystem: string;
  architecture: string;

  constructor(init?: NodeSystemInfo) {
    if (!init) {  return; }
    if (init.machineID) { this.machineID = init.machineID; }
    if (init.systemUUID) { this.systemUUID = init.systemUUID; }
    if (init.bootID) { this.bootID = init.bootID; }
    if (init.kernelVersion) { this.kernelVersion = init.kernelVersion; }
    if (init.osImage) { this.osImage = init.osImage; }
    if (init.containerRuntimeVersion) { this.containerRuntimeVersion = init.containerRuntimeVersion; }
    if (init.kubeletVersion) { this.kubeletVersion = init.kubeletVersion; }
    if (init.kubeProxyVersion) { this.kubeProxyVersion = init.kubeProxyVersion; }
    if (init.operatingSystem) { this.operatingSystem = init.operatingSystem; }
    if (init.architecture) { this.architecture = init.architecture; }
  }


  static emptyObject(): NodeSystemInfo {
    const result = new NodeSystemInfo();
    return result;
  }

}

export class DaemonEndpoint {
  Port: number;

  constructor(init?: DaemonEndpoint) {
    if (!init) {  return; }
    if (init.Port) { this.Port = init.Port; }
  }


  static emptyObject(): DaemonEndpoint {
    const result = new DaemonEndpoint();
    return result;
  }

}

export class NodeDaemonEndpoints {
  kubeletEndpoint: DaemonEndpoint;

  constructor(init?: NodeDaemonEndpoints) {
    if (!init) {  return; }
    if (init.kubeletEndpoint) { this.kubeletEndpoint = init.kubeletEndpoint; }
  }


  static emptyObject(): NodeDaemonEndpoints {
    const result = new NodeDaemonEndpoints();
    result.kubeletEndpoint = DaemonEndpoint.emptyObject();
    return result;
  }

}

export class NodeAddress {
  type: string;
  address: string;

  constructor(init?: NodeAddress) {
    if (!init) {  return; }
    if (init.type) { this.type = init.type; }
    if (init.address) { this.address = init.address; }
  }


  static emptyObject(): NodeAddress {
    const result = new NodeAddress();
    return result;
  }

}


export class NodeCondition {
  type: string;
  status: string;
  lastHeartbeatTime: Time;
  lastTransitionTime: Time;
  reason: string;
  message: string;

  constructor(init?: NodeCondition) {
    if (!init) {  return; }
    if (init.type) { this.type = init.type; }
    if (init.status) { this.status = init.status; }
    if (init.lastHeartbeatTime) { this.lastHeartbeatTime = init.lastHeartbeatTime; }
    if (init.lastTransitionTime) { this.lastTransitionTime = init.lastTransitionTime; }
    if (init.reason) { this.reason = init.reason; }
    if (init.message) { this.message = init.message; }
  }


  static emptyObject(): NodeCondition {
    const result = new NodeCondition();
    result.lastHeartbeatTime = Time.emptyObject();
    result.lastTransitionTime = Time.emptyObject();
    return result;
  }

}

export class Quantity {
  Format: string;

  constructor(init?: Quantity) {
    if (!init) {  return; }
    if (init.Format) { this.Format = init.Format; }
  }


  static emptyObject(): Quantity {
    const result = new Quantity();
    return result;
  }

}

export class NodeStatus {
  capacity?: { [key: string]: Quantity };
  allocatable?: { [key: string]: Quantity };
  phase: string;
  conditions: NodeCondition[];
  addresses: NodeAddress[];
  daemonEndpoints: NodeDaemonEndpoints;
  nodeInfo: NodeSystemInfo;
  images: ContainerImage[];
  volumesInUse: string[];
  volumesAttached: AttachedVolume[];

  constructor(init?: NodeStatus) {
    if (!init) {  return; }
    if (init.capacity) { this.capacity = init.capacity; }
    if (init.allocatable) { this.allocatable = init.allocatable; }
    if (init.phase) { this.phase = init.phase; }
    if (init.conditions) { this.conditions = init.conditions; }
    if (init.addresses) { this.addresses = init.addresses; }
    if (init.daemonEndpoints) { this.daemonEndpoints = init.daemonEndpoints; }
    if (init.nodeInfo) { this.nodeInfo = init.nodeInfo; }
    if (init.images) { this.images = init.images; }
    if (init.volumesInUse) { this.volumesInUse = init.volumesInUse; }
    if (init.volumesAttached) { this.volumesAttached = init.volumesAttached; }
  }


  static emptyObject(): NodeStatus {
    const result = new NodeStatus();
    result.capacity = null;
    result.allocatable = null;
    result.conditions = [];
    result.addresses = [];
    result.daemonEndpoints = NodeDaemonEndpoints.emptyObject();
    result.nodeInfo = NodeSystemInfo.emptyObject();
    result.images = [];
    result.volumesInUse = [];
    result.volumesAttached = [];
    return result;
  }

}

export class ObjectReference {
  kind: string;
  namespace: string;
  name: string;
  uid: string;
  apiVersion: string;
  resourceVersion: string;
  fieldPath: string;

  constructor(init?: ObjectReference) {
    if (!init) {  return; }
    if (init.kind) { this.kind = init.kind; }
    if (init.namespace) { this.namespace = init.namespace; }
    if (init.name) { this.name = init.name; }
    if (init.uid) { this.uid = init.uid; }
    if (init.apiVersion) { this.apiVersion = init.apiVersion; }
    if (init.resourceVersion) { this.resourceVersion = init.resourceVersion; }
    if (init.fieldPath) { this.fieldPath = init.fieldPath; }
  }


  static emptyObject(): ObjectReference {
    const result = new ObjectReference();
    return result;
  }

}

export class NodeConfigSource {
  kind: string;
  apiVersion: string;
  configMapRef?: ObjectReference;

  constructor(init?: NodeConfigSource) {
    if (!init) {  return; }
    if (init.kind) { this.kind = init.kind; }
    if (init.apiVersion) { this.apiVersion = init.apiVersion; }
    if (init.configMapRef) { this.configMapRef = init.configMapRef; }
  }


  static emptyObject(): NodeConfigSource {
    const result = new NodeConfigSource();
    result.configMapRef = ObjectReference.emptyObject();
    return result;
  }

}

export class Taint {
  key: string;
  value: string;
  effect: string;
  timeAdded?: Time;

  constructor(init?: Taint) {
    if (!init) {  return; }
    if (init.key) { this.key = init.key; }
    if (init.value) { this.value = init.value; }
    if (init.effect) { this.effect = init.effect; }
    if (init.timeAdded) { this.timeAdded = init.timeAdded; }
  }


  static emptyObject(): Taint {
    const result = new Taint();
    result.timeAdded = Time.emptyObject();
    return result;
  }

}

export class NodeSpec {
  podCIDR: string;
  externalID: string;
  providerID: string;
  unschedulable: boolean;
  taints: Taint[];
  configSource?: NodeConfigSource;

  constructor(init?: NodeSpec) {
    if (!init) {  return; }
    if (init.podCIDR) { this.podCIDR = init.podCIDR; }
    if (init.externalID) { this.externalID = init.externalID; }
    if (init.providerID) { this.providerID = init.providerID; }
    if (init.unschedulable) { this.unschedulable = init.unschedulable; }
    if (init.taints) { this.taints = init.taints; }
    if (init.configSource) { this.configSource = init.configSource; }
  }


  static emptyObject(): NodeSpec {
    const result = new NodeSpec();
    result.taints = [];
    result.configSource = NodeConfigSource.emptyObject();
    return result;
  }

}

export class StatusCause {
  reason: string;
  message: string;
  field: string;

  constructor(init?: StatusCause) {
    if (!init) {  return; }
    if (init.reason) { this.reason = init.reason; }
    if (init.message) { this.message = init.message; }
    if (init.field) { this.field = init.field; }
  }


  static emptyObject(): StatusCause {
    const result = new StatusCause();
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
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.group) { this.group = init.group; }
    if (init.kind) { this.kind = init.kind; }
    if (init.uid) { this.uid = init.uid; }
    if (init.causes) { this.causes = init.causes; }
    if (init.retryAfterSeconds) { this.retryAfterSeconds = init.retryAfterSeconds; }
  }


  static emptyObject(): StatusDetails {
    const result = new StatusDetails();
    result.causes = [];
    return result;
  }

}

export class ListMeta {
  selfLink: string;
  resourceVersion: string;
  continue: string;

  constructor(init?: ListMeta) {
    if (!init) {  return; }
    if (init.selfLink) { this.selfLink = init.selfLink; }
    if (init.resourceVersion) { this.resourceVersion = init.resourceVersion; }
    if (init.continue) { this.continue = init.continue; }
  }


  static emptyObject(): ListMeta {
    const result = new ListMeta();
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
    if (!init) {  return; }
    if (init.kind) { this.kind = init.kind; }
    if (init.apiVersion) { this.apiVersion = init.apiVersion; }
    if (init.metadata) { this.metadata = init.metadata; }
    if (init.status) { this.status = init.status; }
    if (init.message) { this.message = init.message; }
    if (init.reason) { this.reason = init.reason; }
    if (init.details) { this.details = init.details; }
    if (init.code) { this.code = init.code; }
  }


  static emptyObject(): Status {
    const result = new Status();
    result.metadata = ListMeta.emptyObject();
    result.details = StatusDetails.emptyObject();
    return result;
  }

}

export class Initializer {
  name: string;

  constructor(init?: Initializer) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
  }


  static emptyObject(): Initializer {
    const result = new Initializer();
    return result;
  }

}

export class Initializers {
  pending: Initializer[];
  result?: Status;

  constructor(init?: Initializers) {
    if (!init) {  return; }
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
    if (!init) {  return; }
    if (init.apiVersion) { this.apiVersion = init.apiVersion; }
    if (init.kind) { this.kind = init.kind; }
    if (init.name) { this.name = init.name; }
    if (init.uid) { this.uid = init.uid; }
    if (init.controller) { this.controller = init.controller; }
    if (init.blockOwnerDeletion) { this.blockOwnerDeletion = init.blockOwnerDeletion; }
  }


  static emptyObject(): OwnerReference {
    const result = new OwnerReference();
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
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
  ownerReferences: OwnerReference[];
  initializers?: Initializers;
  finalizers: string[];
  clusterName: string;

  constructor(init?: ObjectMeta) {
    if (!init) {  return; }
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
    result.creationTimestamp = Time.emptyObject();
    result.deletionTimestamp = Time.emptyObject();
    result.labels = null;
    result.annotations = null;
    result.ownerReferences = [];
    result.initializers = Initializers.emptyObject();
    result.finalizers = [];
    return result;
  }

}

export class KubeNode {
  kind: string;
  apiVersion: string;
  metadata: ObjectMeta;
  spec: NodeSpec;
  status: NodeStatus;

  constructor(init?: KubeNode) {
    if (!init) {  return; }
    if (init.kind) { this.kind = init.kind; }
    if (init.apiVersion) { this.apiVersion = init.apiVersion; }
    if (init.metadata) { this.metadata = init.metadata; }
    if (init.spec) { this.spec = init.spec; }
    if (init.status) { this.status = init.status; }
  }


  static emptyObject(): KubeNode {
    const result = new KubeNode();
    result.metadata = ObjectMeta.emptyObject();
    result.spec = NodeSpec.emptyObject();
    result.status = NodeStatus.emptyObject();
    return result;
  }

}
