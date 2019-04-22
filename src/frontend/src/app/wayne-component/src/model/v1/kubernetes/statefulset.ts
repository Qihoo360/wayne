/* Do not change, this code is generated from Golang structs */

export class IntOrString {
  Type: number;
  IntVal: number;
  StrVal: string;

  constructor(init?: IntOrString) {
    if (!init) {  return; }
    if (init.Type) { this.Type = init.Type; }
    if (init.IntVal) { this.IntVal = init.IntVal; }
    if (init.StrVal) { this.StrVal = init.StrVal; }
  }


  static emptyObject(): IntOrString {
    const result = new IntOrString();
    return result;
  }
}

export class LabelSelectorRequirement {
  key: string;
  operator: string;
  values: string[];

  constructor(init?: LabelSelectorRequirement) {
    if (!init) {  return; }
    if (init.key) { this.key = init.key; }
    if (init.operator) { this.operator = init.operator; }
    if (init.values) { this.values = init.values; }
  }


  static emptyObject(): LabelSelectorRequirement {
    const result = new LabelSelectorRequirement();
    result.values = [];
    return result;
  }

}

export class LabelSelector {
  matchLabels?: { [key: string]: string };
  matchExpressions: LabelSelectorRequirement[];

  constructor(init?: LabelSelector) {
    if (!init) {  return; }
    if (init.matchLabels) { this.matchLabels = init.matchLabels; }
    if (init.matchExpressions) { this.matchExpressions = init.matchExpressions; }
  }

  static emptyObject(): LabelSelector {
    const result = new LabelSelector();
    result.matchLabels = null;
    result.matchExpressions = [];
    return result;
  }

}

export class PodAffinityTerm {
  labelSelector?: LabelSelector;
  namespaces: string[];
  topologyKey: string;

  constructor(init?: PodAffinityTerm) {
    if (!init) {  return; }
    if (init.labelSelector) { this.labelSelector = init.labelSelector; }
    if (init.namespaces) { this.namespaces = init.namespaces; }
    if (init.topologyKey) { this.topologyKey = init.topologyKey; }
  }


  static emptyObject(): PodAffinityTerm {
    const result = new PodAffinityTerm();
    result.labelSelector = LabelSelector.emptyObject();
    result.namespaces = [];
    return result;
  }

}

export class StatefulSetCondition {
  type: string;
  status: string;
  lastTransitionTime: Date;
  reason: string;
  message: string;

  constructor(init?: StatefulSetCondition) {
    if (!init) {  return; }
    if (init.type) { this.type = init.type; }
    if (init.status) { this.status = init.status; }
    if (init.lastTransitionTime) { this.lastTransitionTime = init.lastTransitionTime; }
    if (init.reason) { this.reason = init.reason; }
    if (init.message) { this.message = init.message; }
  }


  static emptyObject(): StatefulSetCondition {
    const result = new StatefulSetCondition();
    result.lastTransitionTime = null;
    return result;
  }

}

export class StatefulSetStatus {
  observedGeneration?: number;
  replicas: number;
  readyReplicas: number;
  currentReplicas: number;
  updatedReplicas: number;
  currentRevision: string;
  updateRevision: string;
  collisionCount?: number;
  conditions: StatefulSetCondition[];

  constructor(init?: StatefulSetStatus) {
    if (!init) {  return; }
    if (init.observedGeneration) { this.observedGeneration = init.observedGeneration; }
    if (init.replicas) { this.replicas = init.replicas; }
    if (init.readyReplicas) { this.readyReplicas = init.readyReplicas; }
    if (init.currentReplicas) { this.currentReplicas = init.currentReplicas; }
    if (init.updatedReplicas) { this.updatedReplicas = init.updatedReplicas; }
    if (init.currentRevision) { this.currentRevision = init.currentRevision; }
    if (init.updateRevision) { this.updateRevision = init.updateRevision; }
    if (init.collisionCount) { this.collisionCount = init.collisionCount; }
    if (init.conditions) { this.conditions = init.conditions; }
  }


  static emptyObject(): StatefulSetStatus {
    const result = new StatefulSetStatus();
    result.conditions = [];
    return result;
  }

}

export class RollingUpdateStatefulSetStrategy {
  partition?: number;

  constructor(init?: RollingUpdateStatefulSetStrategy) {
    if (!init) {  return; }
    if (init.partition) { this.partition = init.partition; }
  }


  static emptyObject(): RollingUpdateStatefulSetStrategy {
    const result = new RollingUpdateStatefulSetStrategy();
    return result;
  }

}

export class StatefulSetUpdateStrategy {
  type: string;
  rollingUpdate?: RollingUpdateStatefulSetStrategy;

  constructor(init?: StatefulSetUpdateStrategy) {
    if (!init) {  return; }
    if (init.type) { this.type = init.type; }
    if (init.rollingUpdate) { this.rollingUpdate = init.rollingUpdate; }
  }


  static emptyObject(): StatefulSetUpdateStrategy {
    const result = new StatefulSetUpdateStrategy();
    result.rollingUpdate = RollingUpdateStatefulSetStrategy.emptyObject();
    return result;
  }

}

export class PersistentVolumeClaimCondition {
  type: string;
  status: string;
  lastProbeTime: Date;
  lastTransitionTime: Date;
  reason: string;
  message: string;

  constructor(init?: PersistentVolumeClaimCondition) {
    if (!init) {  return; }
    if (init.type) { this.type = init.type; }
    if (init.status) { this.status = init.status; }
    if (init.lastProbeTime) { this.lastProbeTime = init.lastProbeTime; }
    if (init.lastTransitionTime) { this.lastTransitionTime = init.lastTransitionTime; }
    if (init.reason) { this.reason = init.reason; }
    if (init.message) { this.message = init.message; }
  }


  static emptyObject(): PersistentVolumeClaimCondition {
    const result = new PersistentVolumeClaimCondition();
    result.lastProbeTime = null;
    result.lastTransitionTime = null;
    return result;
  }

}

export class PersistentVolumeClaimStatus {
  phase: string;
  accessModes: string[];
  capacity?: { [key: string]: string };
  conditions: PersistentVolumeClaimCondition[];

  constructor(init?: PersistentVolumeClaimStatus) {
    if (!init) {  return; }
    if (init.phase) { this.phase = init.phase; }
    if (init.accessModes) { this.accessModes = init.accessModes; }
    if (init.capacity) { this.capacity = init.capacity; }
    if (init.conditions) { this.conditions = init.conditions; }
  }


  static emptyObject(): PersistentVolumeClaimStatus {
    const result = new PersistentVolumeClaimStatus();
    result.accessModes = [];
    result.capacity = null;
    result.conditions = [];
    return result;
  }

}

export class ResourceRequirements {
  limits?: { [key: string]: any };
  requests?: { [key: string]: any };

  constructor(init?: ResourceRequirements) {
    if (!init) {  return; }
    if (init.limits) {  this.limits = init.limits; }
    if (init.requests) { this.requests = init.requests; }
  }


  static emptyObject(): ResourceRequirements {
    const result = new ResourceRequirements();
    result.limits = null;
    result.requests = null;
    return result;
  }
}

export class PersistentVolumeClaimSpec {
  accessModes: string[];
  selector?: LabelSelector;
  resources: ResourceRequirements;
  volumeName: string;
  storageClassName?: string;
  volumeMode?: string;

  constructor(init?: PersistentVolumeClaimSpec) {
    if (!init) {  return; }
    if (init.accessModes) { this.accessModes = init.accessModes; }
    if (init.selector) { this.selector = init.selector; }
    if (init.resources) { this.resources = init.resources; }
    if (init.volumeName) { this.volumeName = init.volumeName; }
    if (init.storageClassName) { this.storageClassName = init.storageClassName; }
    if (init.volumeMode) { this.volumeMode = init.volumeMode; }
  }


  static emptyObject(): PersistentVolumeClaimSpec {
    const result = new PersistentVolumeClaimSpec();
    result.accessModes = [];
    result.selector = LabelSelector.emptyObject();
    result.resources = ResourceRequirements.emptyObject();
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
  creationTimestamp: Date;
  deletionTimestamp: Date;
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
    result.creationTimestamp = null;
    result.deletionTimestamp = null;
    result.labels = null;
    result.annotations = null;
    result.ownerReferences = [];
    result.initializers = Initializers.emptyObject();
    result.finalizers = [];
    return result;
  }

}

export class PersistentVolumeClaim {
  kind: string;
  apiVersion: string;
  metadata: ObjectMeta;
  spec: PersistentVolumeClaimSpec;
  status: PersistentVolumeClaimStatus;

  constructor(init?: PersistentVolumeClaim) {
    if (!init) {  return; }
    if (init.kind) { this.kind = init.kind; }
    if (init.apiVersion) { this.apiVersion = init.apiVersion; }
    if (init.metadata) { this.metadata = init.metadata; }
    if (init.spec) { this.spec = init.spec; }
    if (init.status) { this.status = init.status; }
  }


  static emptyObject(): PersistentVolumeClaim {
    const result = new PersistentVolumeClaim();
    result.metadata = ObjectMeta.emptyObject();
    result.spec = PersistentVolumeClaimSpec.emptyObject();
    result.status = PersistentVolumeClaimStatus.emptyObject();
    return result;
  }

}

export class PodDNSConfigOption {
  name: string;
  value?: string;

  constructor(init?: PodDNSConfigOption) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.value) { this.value = init.value; }
  }


  static emptyObject(): PodDNSConfigOption {
    const result = new PodDNSConfigOption();
    return result;
  }

}

export class PodDNSConfig {
  nameservers: string[];
  searches: string[];
  options: PodDNSConfigOption[];

  constructor(init?: PodDNSConfig) {
    if (!init) {  return; }
    if (init.nameservers) { this.nameservers = init.nameservers; }
    if (init.searches) { this.searches = init.searches; }
    if (init.options) { this.options = init.options; }
  }


  static emptyObject(): PodDNSConfig {
    const result = new PodDNSConfig();
    result.nameservers = [];
    result.searches = [];
    result.options = [];
    return result;
  }

}

export class HostAlias {
  ip: string;
  hostnames: string[];

  constructor(init?: HostAlias) {
    if (!init) {  return; }
    if (init.ip) { this.ip = init.ip; }
    if (init.hostnames) { this.hostnames = init.hostnames; }
  }


  static emptyObject(): HostAlias {
    const result = new HostAlias();
    result.hostnames = [];
    return result;
  }

}

export class Toleration {
  key: string;
  operator: string;
  value: string;
  effect: string;
  tolerationSeconds?: number;

  constructor(init?: Toleration) {
    if (!init) {  return; }
    if (init.key) { this.key = init.key; }
    if (init.operator) { this.operator = init.operator; }
    if (init.value) { this.value = init.value; }
    if (init.effect) { this.effect = init.effect; }
    if (init.tolerationSeconds) { this.tolerationSeconds = init.tolerationSeconds; }
  }


  static emptyObject(): Toleration {
    const result = new Toleration();
    return result;
  }

}


export class PodAntiAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution: WeightedPodAffinityTerm[];

  constructor(init?: PodAntiAffinity) {
    if (!init) {  return; }
    if (init.requiredDuringSchedulingIgnoredDuringExecution) {
      this.requiredDuringSchedulingIgnoredDuringExecution = init.requiredDuringSchedulingIgnoredDuringExecution;
    }
    if (init.preferredDuringSchedulingIgnoredDuringExecution) {
      this.preferredDuringSchedulingIgnoredDuringExecution = init.preferredDuringSchedulingIgnoredDuringExecution;
    }
  }


  static emptyObject(): PodAntiAffinity {
    const result = new PodAntiAffinity();
    result.requiredDuringSchedulingIgnoredDuringExecution = [];
    result.preferredDuringSchedulingIgnoredDuringExecution = [];
    return result;
  }

}

export class WeightedPodAffinityTerm {
  weight: number;
  podAffinityTerm: PodAffinityTerm;

  constructor(init?: WeightedPodAffinityTerm) {
    if (!init) {  return; }
    if (init.weight) { this.weight = init.weight; }
    if (init.podAffinityTerm) { this.podAffinityTerm = init.podAffinityTerm; }
  }


  static emptyObject(): WeightedPodAffinityTerm {
    const result = new WeightedPodAffinityTerm();
    result.podAffinityTerm = PodAffinityTerm.emptyObject();
    return result;
  }

}

export class PodAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution: WeightedPodAffinityTerm[];

  constructor(init?: PodAffinity) {
    if (!init) {  return; }
    if (init.requiredDuringSchedulingIgnoredDuringExecution) {
      this.requiredDuringSchedulingIgnoredDuringExecution = init.requiredDuringSchedulingIgnoredDuringExecution;
    }
    if (init.preferredDuringSchedulingIgnoredDuringExecution) {
      this.preferredDuringSchedulingIgnoredDuringExecution = init.preferredDuringSchedulingIgnoredDuringExecution;
    }
  }


  static emptyObject(): PodAffinity {
    const result = new PodAffinity();
    result.requiredDuringSchedulingIgnoredDuringExecution = [];
    result.preferredDuringSchedulingIgnoredDuringExecution = [];
    return result;
  }

}

export class NodeSelectorRequirement {
  key: string;
  operator: string;
  values: string[];

  constructor(init?: NodeSelectorRequirement) {
    if (!init) {  return; }
    if (init.key) { this.key = init.key; }
    if (init.operator) { this.operator = init.operator; }
    if (init.values) { this.values = init.values; }
  }


  static emptyObject(): NodeSelectorRequirement {
    const result = new NodeSelectorRequirement();
    result.values = [];
    return result;
  }

}

export class NodeSelectorTerm {
  matchExpressions: NodeSelectorRequirement[];

  constructor(init?: NodeSelectorTerm) {
    if (!init) {  return; }
    if (init.matchExpressions) { this.matchExpressions = init.matchExpressions; }
  }


  static emptyObject(): NodeSelectorTerm {
    const result = new NodeSelectorTerm();
    result.matchExpressions = [];
    return result;
  }

}

export class PreferredSchedulingTerm {
  weight: number;
  preference: NodeSelectorTerm;

  constructor(init?: PreferredSchedulingTerm) {
    if (!init) {  return; }
    if (init.weight) { this.weight = init.weight; }
    if (init.preference) { this.preference = init.preference; }
  }


  static emptyObject(): PreferredSchedulingTerm {
    const result = new PreferredSchedulingTerm();
    result.preference = NodeSelectorTerm.emptyObject();
    return result;
  }

}



export class NodeSelector {
  nodeSelectorTerms: NodeSelectorTerm[];

  constructor(init?: NodeSelector) {
    if (!init) {  return; }
    if (init.nodeSelectorTerms) { this.nodeSelectorTerms = init.nodeSelectorTerms; }
  }


  static emptyObject(): NodeSelector {
    const result = new NodeSelector();
    result.nodeSelectorTerms = [];
    return result;
  }

}

export class NodeAffinity {
  requiredDuringSchedulingIgnoredDuringExecution?: NodeSelector;
  preferredDuringSchedulingIgnoredDuringExecution: PreferredSchedulingTerm[];

  constructor(init?: NodeAffinity) {
    if (!init) {  return; }
    if (init.requiredDuringSchedulingIgnoredDuringExecution) {
      this.requiredDuringSchedulingIgnoredDuringExecution = init.requiredDuringSchedulingIgnoredDuringExecution;
    }
    if (init.preferredDuringSchedulingIgnoredDuringExecution) {
      this.preferredDuringSchedulingIgnoredDuringExecution = init.preferredDuringSchedulingIgnoredDuringExecution;
    }
  }


  static emptyObject(): NodeAffinity {
    const result = new NodeAffinity();
    result.requiredDuringSchedulingIgnoredDuringExecution = NodeSelector.emptyObject();
    result.preferredDuringSchedulingIgnoredDuringExecution = [];
    return result;
  }

}

export class Affinity {
  nodeAffinity?: NodeAffinity;
  podAffinity?: PodAffinity;
  podAntiAffinity?: PodAntiAffinity;

  constructor(init?: Affinity) {
    if (!init) {  return; }
    if (init.nodeAffinity) { this.nodeAffinity = init.nodeAffinity; }
    if (init.podAffinity) { this.podAffinity = init.podAffinity; }
    if (init.podAntiAffinity) { this.podAntiAffinity = init.podAntiAffinity; }
  }


  static emptyObject(): Affinity {
    const result = new Affinity();
    result.nodeAffinity = NodeAffinity.emptyObject();
    result.podAffinity = PodAffinity.emptyObject();
    result.podAntiAffinity = PodAntiAffinity.emptyObject();
    return result;
  }

}

export class SELinuxOptions {
  user: string;
  role: string;
  type: string;
  level: string;

  constructor(init?: SELinuxOptions) {
    if (!init) {  return; }
    if (init.user) { this.user = init.user; }
    if (init.role) { this.role = init.role; }
    if (init.type) { this.type = init.type; }
    if (init.level) { this.level = init.level; }
  }


  static emptyObject(): SELinuxOptions {
    const result = new SELinuxOptions();
    return result;
  }

}
export class PodSecurityContext {
  seLinuxOptions?: SELinuxOptions;
  runAsUser?: number;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  supplementalGroups: number[];
  fsGroup?: number;

  constructor(init?: PodSecurityContext) {
    if (!init) {  return; }
    if (init.seLinuxOptions) { this.seLinuxOptions = init.seLinuxOptions; }
    if (init.runAsUser) { this.runAsUser = init.runAsUser; }
    if (init.runAsGroup) { this.runAsGroup = init.runAsGroup; }
    if (init.runAsNonRoot) { this.runAsNonRoot = init.runAsNonRoot; }
    if (init.supplementalGroups) { this.supplementalGroups = init.supplementalGroups; }
    if (init.fsGroup) { this.fsGroup = init.fsGroup; }
  }


  static emptyObject(): PodSecurityContext {
    const result = new PodSecurityContext();
    result.seLinuxOptions = SELinuxOptions.emptyObject();
    result.supplementalGroups = [];
    return result;
  }

}

export class Capabilities {
  add: string[];
  drop: string[];

  constructor(init?: Capabilities) {
    if (!init) {  return; }
    if (init.add) { this.add = init.add; }
    if (init.drop) { this.drop = init.drop; }
  }


  static emptyObject(): Capabilities {
    const result = new Capabilities();
    result.add = [];
    result.drop = [];
    return result;
  }

}

export class SecurityContext {
  capabilities?: Capabilities;
  privileged?: boolean;
  seLinuxOptions?: SELinuxOptions;
  runAsUser?: number;
  runAsGroup?: number;
  runAsNonRoot?: boolean;
  readOnlyRootFilesystem?: boolean;
  allowPrivilegeEscalation?: boolean;

  constructor(init?: SecurityContext) {
    if (!init) {  return; }
    if (init.capabilities) { this.capabilities = init.capabilities; }
    if (init.privileged) { this.privileged = init.privileged; }
    if (init.seLinuxOptions) { this.seLinuxOptions = init.seLinuxOptions; }
    if (init.runAsUser) { this.runAsUser = init.runAsUser; }
    if (init.runAsGroup) { this.runAsGroup = init.runAsGroup; }
    if (init.runAsNonRoot) { this.runAsNonRoot = init.runAsNonRoot; }
    if (init.readOnlyRootFilesystem) { this.readOnlyRootFilesystem = init.readOnlyRootFilesystem; }
    if (init.allowPrivilegeEscalation) { this.allowPrivilegeEscalation = init.allowPrivilegeEscalation; }
  }


  static emptyObject(): SecurityContext {
    const result = new SecurityContext();
    result.capabilities = Capabilities.emptyObject();
    result.seLinuxOptions = SELinuxOptions.emptyObject();
    return result;
  }

}

export class ExecAction {
  command: string[];

  constructor(init?: ExecAction) {
    if (!init) {  return; }
    if (init.command) { this.command = init.command; }
  }


  static emptyObject(): ExecAction {
    const result = new ExecAction();
    result.command = [];
    return result;
  }

}

export class TCPSocketAction {
  port: IntOrString;
  host: string;

  constructor(init?: TCPSocketAction) {
    if (!init) {  return; }
    if (init.port) { this.port = init.port; }
    if (init.host) { this.host = init.host; }
  }


  static emptyObject(): TCPSocketAction {
    const result = new TCPSocketAction();
    result.port = IntOrString.emptyObject();
    return result;
  }

}

export class HTTPGetAction {
  path: string;
  port: IntOrString;
  host: string;
  scheme: string;
  httpHeaders: HTTPHeader[];

  constructor(init?: HTTPGetAction) {
    if (!init) {  return; }
    if (init.path) { this.path = init.path; }
    if (init.port) { this.port = init.port; }
    if (init.host) { this.host = init.host; }
    if (init.scheme) { this.scheme = init.scheme; }
    if (init.httpHeaders) { this.httpHeaders = init.httpHeaders; }
  }


  static emptyObject(): HTTPGetAction {
    const result = new HTTPGetAction();
    result.port = IntOrString.emptyObject();
    result.httpHeaders = [];
    return result;
  }

}

export class Handler {
  exec?: ExecAction;
  httpGet?: HTTPGetAction;
  tcpSocket?: TCPSocketAction;

  constructor(init?: Handler) {
    if (!init) {  return; }
    if (init.exec) { this.exec = init.exec; }
    if (init.httpGet) { this.httpGet = init.httpGet; }
    if (init.tcpSocket) { this.tcpSocket = init.tcpSocket; }
  }


  static emptyObject(): Handler {
    const result = new Handler();
    result.exec = ExecAction.emptyObject();
    result.httpGet = HTTPGetAction.emptyObject();
    result.tcpSocket = TCPSocketAction.emptyObject();
    return result;
  }

}

export class Lifecycle {
  postStart?: Handler;
  preStop?: Handler;

  constructor(init?: Lifecycle) {
    if (!init) {  return; }
    if (init.postStart) { this.postStart = init.postStart; }
    if (init.preStop) { this.preStop = init.preStop; }
  }


  static emptyObject(): Lifecycle {
    const result = new Lifecycle();
    result.postStart = Handler.emptyObject();
    result.preStop = Handler.emptyObject();
    return result;
  }

}

export class HTTPHeader {
  name: string;
  value: string;

  constructor(init?: HTTPHeader) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.value) { this.value = init.value; }
  }


  static emptyObject(): HTTPHeader {
    const result = new HTTPHeader();
    return result;
  }

}

export class Probe {
  exec?: ExecAction;
  httpGet?: HTTPGetAction;
  tcpSocket?: TCPSocketAction;
  initialDelaySeconds: number;
  timeoutSeconds: number;
  periodSeconds: number;
  successThreshold: number;
  failureThreshold: number;

  constructor(init?: Probe) {
    if (!init) {  return; }
    if (init.exec) { this.exec = init.exec; }
    if (init.httpGet) { this.httpGet = init.httpGet; }
    if (init.tcpSocket) { this.tcpSocket = init.tcpSocket; }
    if (init.initialDelaySeconds) { this.initialDelaySeconds = init.initialDelaySeconds; }
    if (init.timeoutSeconds) { this.timeoutSeconds = init.timeoutSeconds; }
    if (init.periodSeconds) { this.periodSeconds = init.periodSeconds; }
    if (init.successThreshold) { this.successThreshold = init.successThreshold; }
    if (init.failureThreshold) { this.failureThreshold = init.failureThreshold; }
  }


  static emptyObject(): Probe {
    const result = new Probe();
    result.exec = ExecAction.emptyObject();
    result.httpGet = HTTPGetAction.emptyObject();
    result.tcpSocket = TCPSocketAction.emptyObject();
    return result;
  }

}

export class VolumeDevice {
  name: string;
  devicePath: string;

  constructor(init?: VolumeDevice) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.devicePath) { this.devicePath = init.devicePath; }
  }


  static emptyObject(): VolumeDevice {
    const result = new VolumeDevice();
    return result;
  }

}

export class VolumeMount {
  name: string;
  readOnly: boolean;
  mountPath: string;
  subPath: string;
  mountPropagation?: string;

  constructor(init?: VolumeMount) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
    if (init.mountPath) { this.mountPath = init.mountPath; }
    if (init.subPath) { this.subPath = init.subPath; }
    if (init.mountPropagation) { this.mountPropagation = init.mountPropagation; }
  }


  static emptyObject(): VolumeMount {
    const result = new VolumeMount();
    return result;
  }

}

export class SecretKeySelector {
  name: string;
  key: string;
  optional?: boolean;

  constructor(init?: SecretKeySelector) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.key) { this.key = init.key; }
    if (init.optional) { this.optional = init.optional; }
  }


  static emptyObject(): SecretKeySelector {
    const result = new SecretKeySelector();
    return result;
  }

}

export class ConfigMapKeySelector {
  name: string;
  key: string;
  optional?: boolean;

  constructor(init?: ConfigMapKeySelector) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.key) { this.key = init.key; }
    if (init.optional) { this.optional = init.optional; }
  }


  static emptyObject(): ConfigMapKeySelector {
    const result = new ConfigMapKeySelector();
    return result;
  }

}

export class ResourceFieldSelector {
  containerName: string;
  resource: string;
  divisor: string;

  constructor(init?: ResourceFieldSelector) {
    if (!init) {  return; }
    if (init.containerName) { this.containerName = init.containerName; }
    if (init.resource) { this.resource = init.resource; }
    if (init.divisor) { this.divisor = init.divisor; }
  }


  static emptyObject(): ResourceFieldSelector {
    const result = new ResourceFieldSelector();
    result.divisor = null;
    return result;
  }

}

export class ObjectFieldSelector {
  apiVersion: string;
  fieldPath: string;

  constructor(init?: ObjectFieldSelector) {
    if (!init) {  return; }
    if (init.apiVersion) { this.apiVersion = init.apiVersion; }
    if (init.fieldPath) { this.fieldPath = init.fieldPath; }
  }


  static emptyObject(): ObjectFieldSelector {
    const result = new ObjectFieldSelector();
    return result;
  }
}

export class EnvVarSource {
  fieldRef?: ObjectFieldSelector;
  resourceFieldRef?: ResourceFieldSelector;
  configMapKeyRef?: ConfigMapKeySelector;
  secretKeyRef?: SecretKeySelector;

  constructor(init?: EnvVarSource) {
    if (!init) {  return; }
    if (init.fieldRef) { this.fieldRef = init.fieldRef; }
    if (init.resourceFieldRef) { this.resourceFieldRef = init.resourceFieldRef; }
    if (init.configMapKeyRef) { this.configMapKeyRef = init.configMapKeyRef; }
    if (init.secretKeyRef) { this.secretKeyRef = init.secretKeyRef; }
  }


  static emptyObject(): EnvVarSource {
    const result = new EnvVarSource();
    result.fieldRef = ObjectFieldSelector.emptyObject();
    result.resourceFieldRef = ResourceFieldSelector.emptyObject();
    result.configMapKeyRef = ConfigMapKeySelector.emptyObject();
    result.secretKeyRef = SecretKeySelector.emptyObject();
    return result;
  }

}

export class EnvVar {
  name: string;
  value: string;
  valueFrom?: EnvVarSource;

  constructor(init?: EnvVar) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.value) { this.value = init.value; }
    if (init.valueFrom) { this.valueFrom = init.valueFrom; }
  }


  static emptyObject(): EnvVar {
    const result = new EnvVar();
    result.valueFrom = EnvVarSource.emptyObject();
    return result;
  }

}

export class SecretEnvSource {
  name: string;
  optional?: boolean;

  constructor(init?: SecretEnvSource) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.optional) { this.optional = init.optional; }
  }


  static emptyObject(): SecretEnvSource {
    const result = new SecretEnvSource();
    return result;
  }

}

export class ConfigMapEnvSource {
  name: string;
  optional?: boolean;

  constructor(init?: ConfigMapEnvSource) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.optional) { this.optional = init.optional; }
  }


  static emptyObject(): ConfigMapEnvSource {
    const result = new ConfigMapEnvSource();
    return result;
  }

}

export class EnvFromSource {
  prefix: string;
  configMapRef?: ConfigMapEnvSource;
  secretRef?: SecretEnvSource;

  constructor(init?: EnvFromSource) {
    if (!init) {  return; }
    if (init.prefix) { this.prefix = init.prefix; }
    if (init.configMapRef) { this.configMapRef = init.configMapRef; }
    if (init.secretRef) { this.secretRef = init.secretRef; }
  }


  static emptyObject(): EnvFromSource {
    const result = new EnvFromSource();
    result.configMapRef = ConfigMapEnvSource.emptyObject();
    result.secretRef = SecretEnvSource.emptyObject();
    return result;
  }

}

export class ContainerPort {
  name: string;
  hostPort: number;
  containerPort: number;
  protocol: string;
  hostIP: string;

  constructor(init?: ContainerPort) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.hostPort) { this.hostPort = init.hostPort; }
    if (init.containerPort) { this.containerPort = init.containerPort; }
    if (init.protocol) { this.protocol = init.protocol; }
    if (init.hostIP) { this.hostIP = init.hostIP; }
  }


  static emptyObject(): ContainerPort {
    const result = new ContainerPort();
    return result;
  }

}

export class Container {
  name: string;
  image: string;
  command: string[];
  args: string[];
  workingDir: string;
  ports: ContainerPort[];
  envFrom: EnvFromSource[];
  env: EnvVar[];
  resources: ResourceRequirements;
  volumeMounts: VolumeMount[];
  volumeDevices: VolumeDevice[];
  livenessProbe?: Probe;
  readinessProbe?: Probe;
  lifecycle?: Lifecycle;
  terminationMessagePath: string;
  terminationMessagePolicy: string;
  imagePullPolicy: string;
  securityContext?: SecurityContext;
  stdin: boolean;
  stdinOnce: boolean;
  tty: boolean;

  constructor(init?: Container) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.image) { this.image = init.image; }
    if (init.command) { this.command = init.command; }
    if (init.args) { this.args = init.args; }
    if (init.workingDir) { this.workingDir = init.workingDir; }
    if (init.ports) { this.ports = init.ports; }
    if (init.envFrom) { this.envFrom = init.envFrom; }
    if (init.env) { this.env = init.env; }
    if (init.resources) { this.resources = init.resources; }
    if (init.volumeMounts) { this.volumeMounts = init.volumeMounts; }
    if (init.volumeDevices) { this.volumeDevices = init.volumeDevices; }
    if (init.livenessProbe) { this.livenessProbe = init.livenessProbe; }
    if (init.readinessProbe) { this.readinessProbe = init.readinessProbe; }
    if (init.lifecycle) { this.lifecycle = init.lifecycle; }
    if (init.terminationMessagePath) { this.terminationMessagePath = init.terminationMessagePath; }
    if (init.terminationMessagePolicy) { this.terminationMessagePolicy = init.terminationMessagePolicy; }
    if (init.imagePullPolicy) { this.imagePullPolicy = init.imagePullPolicy; }
    if (init.securityContext) { this.securityContext = init.securityContext; }
    if (init.stdin) { this.stdin = init.stdin; }
    if (init.stdinOnce) { this.stdinOnce = init.stdinOnce; }
    if (init.tty) { this.tty = init.tty; }
  }


  static emptyObject(): Container {
    const result = new Container();
    result.command = [];
    result.args = [];
    result.ports = [];
    result.envFrom = [];
    result.env = [];
    result.resources = ResourceRequirements.emptyObject();
    result.volumeMounts = [];
    result.volumeDevices = [];
    result.livenessProbe = Probe.emptyObject();
    result.readinessProbe = Probe.emptyObject();
    result.lifecycle = Lifecycle.emptyObject();
    result.securityContext = SecurityContext.emptyObject();
    return result;
  }

}

export class LocalObjectReference {
  name: string;

  constructor(init?: LocalObjectReference) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
  }


  static emptyObject(): LocalObjectReference {
    const result = new LocalObjectReference();
    return result;
  }

}
export class StorageOSVolumeSource {
  volumeName: string;
  volumeNamespace: string;
  fsType: string;
  readOnly: boolean;
  secretRef?: LocalObjectReference;

  constructor(init?: StorageOSVolumeSource) {
    if (!init) {  return; }
    if (init.volumeName) { this.volumeName = init.volumeName; }
    if (init.volumeNamespace) { this.volumeNamespace = init.volumeNamespace; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
    if (init.secretRef) { this.secretRef = init.secretRef; }
  }


  static emptyObject(): StorageOSVolumeSource {
    const result = new StorageOSVolumeSource();
    result.secretRef = LocalObjectReference.emptyObject();
    return result;
  }

}

export class ScaleIOVolumeSource {
  gateway: string;
  system: string;
  secretRef?: LocalObjectReference;
  sslEnabled: boolean;
  protectionDomain: string;
  storagePool: string;
  storageMode: string;
  volumeName: string;
  fsType: string;
  readOnly: boolean;

  constructor(init?: ScaleIOVolumeSource) {
    if (!init) {  return; }
    if (init.gateway) { this.gateway = init.gateway; }
    if (init.system) { this.system = init.system; }
    if (init.secretRef) { this.secretRef = init.secretRef; }
    if (init.sslEnabled) { this.sslEnabled = init.sslEnabled; }
    if (init.protectionDomain) { this.protectionDomain = init.protectionDomain; }
    if (init.storagePool) { this.storagePool = init.storagePool; }
    if (init.storageMode) { this.storageMode = init.storageMode; }
    if (init.volumeName) { this.volumeName = init.volumeName; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): ScaleIOVolumeSource {
    const result = new ScaleIOVolumeSource();
    result.secretRef = LocalObjectReference.emptyObject();
    return result;
  }

}

export class PortworxVolumeSource {
  volumeID: string;
  fsType: string;
  readOnly: boolean;

  constructor(init?: PortworxVolumeSource) {
    if (!init) {  return; }
    if (init.volumeID) { this.volumeID = init.volumeID; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): PortworxVolumeSource {
    const result = new PortworxVolumeSource();
    return result;
  }

}

export class ConfigMapProjection {
  name: string;
  items: KeyToPath[];
  optional?: boolean;

  constructor(init?: ConfigMapProjection) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.items) { this.items = init.items; }
    if (init.optional) { this.optional = init.optional; }
  }


  static emptyObject(): ConfigMapProjection {
    const result = new ConfigMapProjection();
    result.items = [];
    return result;
  }

}

export class DownwardAPIProjection {
  items: DownwardAPIVolumeFile[];

  constructor(init?: DownwardAPIProjection) {
    if (!init) {  return; }
    if (init.items) { this.items = init.items; }
  }


  static emptyObject(): DownwardAPIProjection {
    const result = new DownwardAPIProjection();
    result.items = [];
    return result;
  }

}

export class SecretProjection {
  name: string;
  items: KeyToPath[];
  optional?: boolean;

  constructor(init?: SecretProjection) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.items) { this.items = init.items; }
    if (init.optional) { this.optional = init.optional; }
  }


  static emptyObject(): SecretProjection {
    const result = new SecretProjection();
    result.items = [];
    return result;
  }

}

export class VolumeProjection {
  secret?: SecretProjection;
  downwardAPI?: DownwardAPIProjection;
  configMap?: ConfigMapProjection;

  constructor(init?: VolumeProjection) {
    if (!init) {  return; }
    if (init.secret) { this.secret = init.secret; }
    if (init.downwardAPI) { this.downwardAPI = init.downwardAPI; }
    if (init.configMap) { this.configMap = init.configMap; }
  }


  static emptyObject(): VolumeProjection {
    const result = new VolumeProjection();
    result.secret = SecretProjection.emptyObject();
    result.downwardAPI = DownwardAPIProjection.emptyObject();
    result.configMap = ConfigMapProjection.emptyObject();
    return result;
  }

}

export class ProjectedVolumeSource {
  sources: VolumeProjection[];
  defaultMode?: number;

  constructor(init?: ProjectedVolumeSource) {
    if (!init) {  return; }
    if (init.sources) { this.sources = init.sources; }
    if (init.defaultMode) { this.defaultMode = init.defaultMode; }
  }


  static emptyObject(): ProjectedVolumeSource {
    const result = new ProjectedVolumeSource();
    result.sources = [];
    return result;
  }

}

export class PhotonPersistentDiskVolumeSource {
  pdID: string;
  fsType: string;

  constructor(init?: PhotonPersistentDiskVolumeSource) {
    if (!init) {  return; }
    if (init.pdID) { this.pdID = init.pdID; }
    if (init.fsType) { this.fsType = init.fsType; }
  }


  static emptyObject(): PhotonPersistentDiskVolumeSource {
    const result = new PhotonPersistentDiskVolumeSource();
    return result;
  }

}

export class AzureDiskVolumeSource {
  diskName: string;
  diskURI: string;
  cachingMode?: string;
  fsType?: string;
  readOnly?: boolean;
  kind?: string;

  constructor(init?: AzureDiskVolumeSource) {
    if (!init) {  return; }
    if (init.diskName) { this.diskName = init.diskName; }
    if (init.diskURI) { this.diskURI = init.diskURI; }
    if (init.cachingMode) { this.cachingMode = init.cachingMode; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
    if (init.kind) { this.kind = init.kind; }
  }


  static emptyObject(): AzureDiskVolumeSource {
    const result = new AzureDiskVolumeSource();
    return result;
  }

}

export class QuobyteVolumeSource {
  registry: string;
  volume: string;
  readOnly: boolean;
  user: string;
  group: string;

  constructor(init?: QuobyteVolumeSource) {
    if (!init) {  return; }
    if (init.registry) { this.registry = init.registry; }
    if (init.volume) { this.volume = init.volume; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
    if (init.user) { this.user = init.user; }
    if (init.group) { this.group = init.group; }
  }


  static emptyObject(): QuobyteVolumeSource {
    const result = new QuobyteVolumeSource();
    return result;
  }

}

export class VsphereVirtualDiskVolumeSource {
  volumePath: string;
  fsType: string;
  storagePolicyName: string;
  storagePolicyID: string;

  constructor(init?: VsphereVirtualDiskVolumeSource) {
    if (!init) {  return; }
    if (init.volumePath) { this.volumePath = init.volumePath; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.storagePolicyName) { this.storagePolicyName = init.storagePolicyName; }
    if (init.storagePolicyID) { this.storagePolicyID = init.storagePolicyID; }
  }


  static emptyObject(): VsphereVirtualDiskVolumeSource {
    const result = new VsphereVirtualDiskVolumeSource();
    return result;
  }

}

export class ConfigMapVolumeSource {
  name: string;
  items: KeyToPath[];
  defaultMode?: number;
  optional?: boolean;

  constructor(init?: ConfigMapVolumeSource) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.items) { this.items = init.items; }
    if (init.defaultMode) { this.defaultMode = init.defaultMode; }
    if (init.optional) { this.optional = init.optional; }
  }


  static emptyObject(): ConfigMapVolumeSource {
    const result = new ConfigMapVolumeSource();
    result.items = [];
    return result;
  }

}

export class AzureFileVolumeSource {
  secretName: string;
  shareName: string;
  readOnly: boolean;

  constructor(init?: AzureFileVolumeSource) {
    if (!init) {  return; }
    if (init.secretName) { this.secretName = init.secretName; }
    if (init.shareName) { this.shareName = init.shareName; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): AzureFileVolumeSource {
    const result = new AzureFileVolumeSource();
    return result;
  }

}

export class FCVolumeSource {
  targetWWNs: string[];
  lun?: number;
  fsType: string;
  readOnly: boolean;
  wwids: string[];

  constructor(init?: FCVolumeSource) {
    if (!init) {  return; }
    if (init.targetWWNs) { this.targetWWNs = init.targetWWNs; }
    if (init.lun) { this.lun = init.lun; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
    if (init.wwids) { this.wwids = init.wwids; }
  }


  static emptyObject(): FCVolumeSource {
    const result = new FCVolumeSource();
    result.targetWWNs = [];
    result.wwids = [];
    return result;
  }

}

export class DownwardAPIVolumeFile {
  path: string;
  fieldRef?: ObjectFieldSelector;
  resourceFieldRef?: ResourceFieldSelector;
  mode?: number;

  constructor(init?: DownwardAPIVolumeFile) {
    if (!init) {  return; }
    if (init.path) { this.path = init.path; }
    if (init.fieldRef) { this.fieldRef = init.fieldRef; }
    if (init.resourceFieldRef) { this.resourceFieldRef = init.resourceFieldRef; }
    if (init.mode) { this.mode = init.mode; }
  }


  static emptyObject(): DownwardAPIVolumeFile {
    const result = new DownwardAPIVolumeFile();
    result.fieldRef = ObjectFieldSelector.emptyObject();
    result.resourceFieldRef = ResourceFieldSelector.emptyObject();
    return result;
  }

}

export class DownwardAPIVolumeSource {
  items: DownwardAPIVolumeFile[];
  defaultMode?: number;

  constructor(init?: DownwardAPIVolumeSource) {
    if (!init) {  return; }
    if (init.items) { this.items = init.items; }
    if (init.defaultMode) { this.defaultMode = init.defaultMode; }
  }


  static emptyObject(): DownwardAPIVolumeSource {
    const result = new DownwardAPIVolumeSource();
    result.items = [];
    return result;
  }

}

export class FlockerVolumeSource {
  datasetName: string;
  datasetUUID: string;

  constructor(init?: FlockerVolumeSource) {
    if (!init) {  return; }
    if (init.datasetName) { this.datasetName = init.datasetName; }
    if (init.datasetUUID) { this.datasetUUID = init.datasetUUID; }
  }


  static emptyObject(): FlockerVolumeSource {
    const result = new FlockerVolumeSource();
    return result;
  }

}

export class CephFSVolumeSource {
  monitors: string[];
  path: string;
  user: string;
  secretFile: string;
  secretRef?: LocalObjectReference;
  readOnly: boolean;

  constructor(init?: CephFSVolumeSource) {
    if (!init) {  return; }
    if (init.monitors) { this.monitors = init.monitors; }
    if (init.path) { this.path = init.path; }
    if (init.user) { this.user = init.user; }
    if (init.secretFile) { this.secretFile = init.secretFile; }
    if (init.secretRef) { this.secretRef = init.secretRef; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): CephFSVolumeSource {
    const result = new CephFSVolumeSource();
    result.monitors = [];
    result.secretRef = LocalObjectReference.emptyObject();
    return result;
  }

}

export class CinderVolumeSource {
  volumeID: string;
  fsType: string;
  readOnly: boolean;

  constructor(init?: CinderVolumeSource) {
    if (!init) {  return; }
    if (init.volumeID) { this.volumeID = init.volumeID; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): CinderVolumeSource {
    const result = new CinderVolumeSource();
    return result;
  }

}

export class FlexVolumeSource {
  driver: string;
  fsType: string;
  secretRef?: LocalObjectReference;
  readOnly: boolean;
  options?: { [key: string]: string };

  constructor(init?: FlexVolumeSource) {
    if (!init) {  return; }
    if (init.driver) { this.driver = init.driver; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.secretRef) { this.secretRef = init.secretRef; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
    if (init.options) { this.options = init.options; }
  }


  static emptyObject(): FlexVolumeSource {
    const result = new FlexVolumeSource();
    result.secretRef = LocalObjectReference.emptyObject();
    result.options = null;
    return result;
  }

}

export class RBDVolumeSource {
  monitors: string[];
  image: string;
  fsType: string;
  pool: string;
  user: string;
  keyring: string;
  secretRef?: LocalObjectReference;
  readOnly: boolean;

  constructor(init?: RBDVolumeSource) {
    if (!init) {  return; }
    if (init.monitors) { this.monitors = init.monitors; }
    if (init.image) { this.image = init.image; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.pool) { this.pool = init.pool; }
    if (init.user) { this.user = init.user; }
    if (init.keyring) { this.keyring = init.keyring; }
    if (init.secretRef) { this.secretRef = init.secretRef; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): RBDVolumeSource {
    const result = new RBDVolumeSource();
    result.monitors = [];
    result.secretRef = LocalObjectReference.emptyObject();
    return result;
  }

}

export class PersistentVolumeClaimVolumeSource {
  claimName: string;
  readOnly: boolean;

  constructor(init?: PersistentVolumeClaimVolumeSource) {
    if (!init) {  return; }
    if (init.claimName) { this.claimName = init.claimName; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): PersistentVolumeClaimVolumeSource {
    const result = new PersistentVolumeClaimVolumeSource();
    return result;
  }

}

export class GlusterfsVolumeSource {
  endpoints: string;
  path: string;
  readOnly: boolean;

  constructor(init?: GlusterfsVolumeSource) {
    if (!init) {  return; }
    if (init.endpoints) { this.endpoints = init.endpoints; }
    if (init.path) { this.path = init.path; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): GlusterfsVolumeSource {
    const result = new GlusterfsVolumeSource();
    return result;
  }

}

export class ISCSIVolumeSource {
  targetPortal: string;
  iqn: string;
  lun: number;
  iscsiInterface: string;
  fsType: string;
  readOnly: boolean;
  portals: string[];
  chapAuthDiscovery: boolean;
  chapAuthSession: boolean;
  secretRef?: LocalObjectReference;
  initiatorName?: string;

  constructor(init?: ISCSIVolumeSource) {
    if (!init) {  return; }
    if (init.targetPortal) { this.targetPortal = init.targetPortal; }
    if (init.iqn) { this.iqn = init.iqn; }
    if (init.lun) { this.lun = init.lun; }
    if (init.iscsiInterface) { this.iscsiInterface = init.iscsiInterface; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
    if (init.portals) { this.portals = init.portals; }
    if (init.chapAuthDiscovery) { this.chapAuthDiscovery = init.chapAuthDiscovery; }
    if (init.chapAuthSession) { this.chapAuthSession = init.chapAuthSession; }
    if (init.secretRef) { this.secretRef = init.secretRef; }
    if (init.initiatorName) { this.initiatorName = init.initiatorName; }
  }


  static emptyObject(): ISCSIVolumeSource {
    const result = new ISCSIVolumeSource();
    result.portals = [];
    result.secretRef = LocalObjectReference.emptyObject();
    return result;
  }

}

export class NFSVolumeSource {
  server: string;
  path: string;
  readOnly: boolean;

  constructor(init?: NFSVolumeSource) {
    if (!init) {  return; }
    if (init.server) { this.server = init.server; }
    if (init.path) { this.path = init.path; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): NFSVolumeSource {
    const result = new NFSVolumeSource();
    return result;
  }

}

export class KeyToPath {
  key: string;
  path: string;
  mode?: number;

  constructor(init?: KeyToPath) {
    if (!init) {  return; }
    if (init.key) { this.key = init.key; }
    if (init.path) { this.path = init.path; }
    if (init.mode) { this.mode = init.mode; }
  }


  static emptyObject(): KeyToPath {
    const result = new KeyToPath();
    return result;
  }

}

export class SecretVolumeSource {
  secretName: string;
  items: KeyToPath[];
  defaultMode?: number;
  optional?: boolean;

  constructor(init?: SecretVolumeSource) {
    if (!init) {  return; }
    if (init.secretName) { this.secretName = init.secretName; }
    if (init.items) { this.items = init.items; }
    if (init.defaultMode) { this.defaultMode = init.defaultMode; }
    if (init.optional) { this.optional = init.optional; }
  }


  static emptyObject(): SecretVolumeSource {
    const result = new SecretVolumeSource();
    result.items = [];
    return result;
  }

}

export class GitRepoVolumeSource {
  repository: string;
  revision: string;
  directory: string;

  constructor(init?: GitRepoVolumeSource) {
    if (!init) {  return; }
    if (init.repository) { this.repository = init.repository; }
    if (init.revision) { this.revision = init.revision; }
    if (init.directory) { this.directory = init.directory; }
  }


  static emptyObject(): GitRepoVolumeSource {
    const result = new GitRepoVolumeSource();
    return result;
  }

}

export class AWSElasticBlockStoreVolumeSource {
  volumeID: string;
  fsType: string;
  partition: number;
  readOnly: boolean;

  constructor(init?: AWSElasticBlockStoreVolumeSource) {
    if (!init) {  return; }
    if (init.volumeID) { this.volumeID = init.volumeID; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.partition) { this.partition = init.partition; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): AWSElasticBlockStoreVolumeSource {
    const result = new AWSElasticBlockStoreVolumeSource();
    return result;
  }

}

export class GCEPersistentDiskVolumeSource {
  pdName: string;
  fsType: string;
  partition: number;
  readOnly: boolean;

  constructor(init?: GCEPersistentDiskVolumeSource) {
    if (!init) {  return; }
    if (init.pdName) { this.pdName = init.pdName; }
    if (init.fsType) { this.fsType = init.fsType; }
    if (init.partition) { this.partition = init.partition; }
    if (init.readOnly) { this.readOnly = init.readOnly; }
  }


  static emptyObject(): GCEPersistentDiskVolumeSource {
    const result = new GCEPersistentDiskVolumeSource();
    return result;
  }

}

export class EmptyDirVolumeSource {
  medium: string;
  sizeLimit: string;

  constructor(init?: EmptyDirVolumeSource) {
    if (!init) {  return; }
    if (init.medium) { this.medium = init.medium; }
    if (init.sizeLimit) { this.sizeLimit = init.sizeLimit; }
  }


  static emptyObject(): EmptyDirVolumeSource {
    const result = new EmptyDirVolumeSource();
    result.sizeLimit = null;
    return result;
  }

}

export class HostPathVolumeSource {
  path: string;
  type?: string;

  constructor(init?: HostPathVolumeSource) {
    if (!init) {  return; }
    if (init.path) { this.path = init.path; }
    if (init.type) { this.type = init.type; }
  }


  static emptyObject(): HostPathVolumeSource {
    const result = new HostPathVolumeSource();
    return result;
  }

}

export class Volume {
  name: string;
  hostPath?: HostPathVolumeSource;
  emptyDir?: EmptyDirVolumeSource;
  gcePersistentDisk?: GCEPersistentDiskVolumeSource;
  awsElasticBlockStore?: AWSElasticBlockStoreVolumeSource;
  gitRepo?: GitRepoVolumeSource;
  secret?: SecretVolumeSource;
  nfs?: NFSVolumeSource;
  iscsi?: ISCSIVolumeSource;
  glusterfs?: GlusterfsVolumeSource;
  persistentVolumeClaim?: PersistentVolumeClaimVolumeSource;
  rbd?: RBDVolumeSource;
  flexVolume?: FlexVolumeSource;
  cinder?: CinderVolumeSource;
  cephfs?: CephFSVolumeSource;
  flocker?: FlockerVolumeSource;
  downwardAPI?: DownwardAPIVolumeSource;
  fc?: FCVolumeSource;
  azureFile?: AzureFileVolumeSource;
  configMap?: ConfigMapVolumeSource;
  vsphereVolume?: VsphereVirtualDiskVolumeSource;
  quobyte?: QuobyteVolumeSource;
  azureDisk?: AzureDiskVolumeSource;
  photonPersistentDisk?: PhotonPersistentDiskVolumeSource;
  projected?: ProjectedVolumeSource;
  portworxVolume?: PortworxVolumeSource;
  scaleIO?: ScaleIOVolumeSource;
  storageos?: StorageOSVolumeSource;

  constructor(init?: Volume) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.hostPath) { this.hostPath = init.hostPath; }
    if (init.emptyDir) { this.emptyDir = init.emptyDir; }
    if (init.gcePersistentDisk) { this.gcePersistentDisk = init.gcePersistentDisk; }
    if (init.awsElasticBlockStore) { this.awsElasticBlockStore = init.awsElasticBlockStore; }
    if (init.gitRepo) { this.gitRepo = init.gitRepo; }
    if (init.secret) { this.secret = init.secret; }
    if (init.nfs) { this.nfs = init.nfs; }
    if (init.iscsi) { this.iscsi = init.iscsi; }
    if (init.glusterfs) { this.glusterfs = init.glusterfs; }
    if (init.persistentVolumeClaim) { this.persistentVolumeClaim = init.persistentVolumeClaim; }
    if (init.rbd) { this.rbd = init.rbd; }
    if (init.flexVolume) { this.flexVolume = init.flexVolume; }
    if (init.cinder) { this.cinder = init.cinder; }
    if (init.cephfs) { this.cephfs = init.cephfs; }
    if (init.flocker) { this.flocker = init.flocker; }
    if (init.downwardAPI) { this.downwardAPI = init.downwardAPI; }
    if (init.fc) { this.fc = init.fc; }
    if (init.azureFile) { this.azureFile = init.azureFile; }
    if (init.configMap) { this.configMap = init.configMap; }
    if (init.vsphereVolume) { this.vsphereVolume = init.vsphereVolume; }
    if (init.quobyte) { this.quobyte = init.quobyte; }
    if (init.azureDisk) { this.azureDisk = init.azureDisk; }
    if (init.photonPersistentDisk) { this.photonPersistentDisk = init.photonPersistentDisk; }
    if (init.projected) { this.projected = init.projected; }
    if (init.portworxVolume) { this.portworxVolume = init.portworxVolume; }
    if (init.scaleIO) { this.scaleIO = init.scaleIO; }
    if (init.storageos) { this.storageos = init.storageos; }
  }


  static emptyObject(): Volume {
    const result = new Volume();
    result.hostPath = HostPathVolumeSource.emptyObject();
    result.emptyDir = EmptyDirVolumeSource.emptyObject();
    result.gcePersistentDisk = GCEPersistentDiskVolumeSource.emptyObject();
    result.awsElasticBlockStore = AWSElasticBlockStoreVolumeSource.emptyObject();
    result.gitRepo = GitRepoVolumeSource.emptyObject();
    result.secret = SecretVolumeSource.emptyObject();
    result.nfs = NFSVolumeSource.emptyObject();
    result.iscsi = ISCSIVolumeSource.emptyObject();
    result.glusterfs = GlusterfsVolumeSource.emptyObject();
    result.persistentVolumeClaim = PersistentVolumeClaimVolumeSource.emptyObject();
    result.rbd = RBDVolumeSource.emptyObject();
    result.flexVolume = FlexVolumeSource.emptyObject();
    result.cinder = CinderVolumeSource.emptyObject();
    result.cephfs = CephFSVolumeSource.emptyObject();
    result.flocker = FlockerVolumeSource.emptyObject();
    result.downwardAPI = DownwardAPIVolumeSource.emptyObject();
    result.fc = FCVolumeSource.emptyObject();
    result.azureFile = AzureFileVolumeSource.emptyObject();
    result.configMap = ConfigMapVolumeSource.emptyObject();
    result.vsphereVolume = VsphereVirtualDiskVolumeSource.emptyObject();
    result.quobyte = QuobyteVolumeSource.emptyObject();
    result.azureDisk = AzureDiskVolumeSource.emptyObject();
    result.photonPersistentDisk = PhotonPersistentDiskVolumeSource.emptyObject();
    result.projected = ProjectedVolumeSource.emptyObject();
    result.portworxVolume = PortworxVolumeSource.emptyObject();
    result.scaleIO = ScaleIOVolumeSource.emptyObject();
    result.storageos = StorageOSVolumeSource.emptyObject();
    return result;
  }

}

export class PodSpec {
  volumes: Volume[];
  initContainers: Container[];
  containers: Container[];
  restartPolicy: string;
  terminationGracePeriodSeconds?: number;
  activeDeadlineSeconds?: number;
  dnsPolicy: string;
  nodeSelector?: { [key: string]: string };
  serviceAccountName: string;
  serviceAccount: string;
  automountServiceAccountToken?: boolean;
  nodeName: string;
  hostNetwork: boolean;
  hostPID: boolean;
  hostIPC: boolean;
  shareProcessNamespace?: boolean;
  securityContext?: PodSecurityContext;
  imagePullSecrets: LocalObjectReference[];
  hostname: string;
  subdomain: string;
  affinity?: Affinity;
  schedulerName: string;
  tolerations: Toleration[];
  hostAliases: HostAlias[];
  priorityClassName: string;
  priority?: number;
  dnsConfig?: PodDNSConfig;

  constructor(init?: PodSpec) {
    if (!init) {  return; }
    if (init.volumes) { this.volumes = init.volumes; }
    if (init.initContainers) { this.initContainers = init.initContainers; }
    if (init.containers) { this.containers = init.containers; }
    if (init.restartPolicy) { this.restartPolicy = init.restartPolicy; }
    if (init.terminationGracePeriodSeconds) { this.terminationGracePeriodSeconds = init.terminationGracePeriodSeconds; }
    if (init.activeDeadlineSeconds) { this.activeDeadlineSeconds = init.activeDeadlineSeconds; }
    if (init.dnsPolicy) { this.dnsPolicy = init.dnsPolicy; }
    if (init.nodeSelector) { this.nodeSelector = init.nodeSelector; }
    if (init.serviceAccountName) { this.serviceAccountName = init.serviceAccountName; }
    if (init.serviceAccount) { this.serviceAccount = init.serviceAccount; }
    if (init.automountServiceAccountToken) { this.automountServiceAccountToken = init.automountServiceAccountToken; }
    if (init.nodeName) { this.nodeName = init.nodeName; }
    if (init.hostNetwork) { this.hostNetwork = init.hostNetwork; }
    if (init.hostPID) { this.hostPID = init.hostPID; }
    if (init.hostIPC) { this.hostIPC = init.hostIPC; }
    if (init.shareProcessNamespace) { this.shareProcessNamespace = init.shareProcessNamespace; }
    if (init.securityContext) { this.securityContext = init.securityContext; }
    if (init.imagePullSecrets) { this.imagePullSecrets = init.imagePullSecrets; }
    if (init.hostname) { this.hostname = init.hostname; }
    if (init.subdomain) { this.subdomain = init.subdomain; }
    if (init.affinity) { this.affinity = init.affinity; }
    if (init.schedulerName) { this.schedulerName = init.schedulerName; }
    if (init.tolerations) { this.tolerations = init.tolerations; }
    if (init.hostAliases) { this.hostAliases = init.hostAliases; }
    if (init.priorityClassName) { this.priorityClassName = init.priorityClassName; }
    if (init.priority) { this.priority = init.priority; }
    if (init.dnsConfig) { this.dnsConfig = init.dnsConfig; }
  }


  static emptyObject(): PodSpec {
    const result = new PodSpec();
    result.volumes = [];
    result.initContainers = [];
    result.containers = [];
    result.nodeSelector = null;
    result.securityContext = PodSecurityContext.emptyObject();
    result.imagePullSecrets = [];
    result.affinity = Affinity.emptyObject();
    result.tolerations = [];
    result.hostAliases = [];
    result.dnsConfig = PodDNSConfig.emptyObject();
    return result;
  }

}

export class PodTemplateSpec {
  metadata: ObjectMeta;
  spec: PodSpec;

  constructor(init?: PodTemplateSpec) {
    if (!init) {  return; }
    if (init.metadata) { this.metadata = init.metadata; }
    if (init.spec) { this.spec = init.spec; }
  }


  static emptyObject(): PodTemplateSpec {
    const result = new PodTemplateSpec();
    result.metadata = ObjectMeta.emptyObject();
    result.spec = PodSpec.emptyObject();
    return result;
  }

}

export class StatefulSetSpec {
  replicas?: number;
  selector?: LabelSelector;
  template: PodTemplateSpec;
  volumeClaimTemplates: PersistentVolumeClaim[];
  serviceName: string;
  podManagementPolicy: string;
  updateStrategy: StatefulSetUpdateStrategy;
  revisionHistoryLimit?: number;

  constructor(init?: StatefulSetSpec) {
    if (!init) {  return; }
    if (init.replicas) { this.replicas = init.replicas; }
    if (init.selector) { this.selector = init.selector; }
    if (init.template) { this.template = init.template; }
    if (init.volumeClaimTemplates) { this.volumeClaimTemplates = init.volumeClaimTemplates; }
    if (init.serviceName) { this.serviceName = init.serviceName; }
    if (init.podManagementPolicy) { this.podManagementPolicy = init.podManagementPolicy; }
    if (init.updateStrategy) { this.updateStrategy = init.updateStrategy; }
    if (init.revisionHistoryLimit) { this.revisionHistoryLimit = init.revisionHistoryLimit; }
  }


  static emptyObject(): StatefulSetSpec {
    const result = new StatefulSetSpec();
    result.selector = LabelSelector.emptyObject();
    result.template = PodTemplateSpec.emptyObject();
    result.volumeClaimTemplates = [];
    result.updateStrategy = StatefulSetUpdateStrategy.emptyObject();
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

export class KubeStatefulSet {
  kind: string;
  apiVersion: string;
  metadata: ObjectMeta;
  spec: StatefulSetSpec;
  status: StatefulSetStatus;

  constructor(init?: KubeStatefulSet) {
    if (!init) {  return; }
    if (init.kind) { this.kind = init.kind; }
    if (init.apiVersion) { this.apiVersion = init.apiVersion; }
    if (init.metadata) { this.metadata = init.metadata; }
    if (init.spec) { this.spec = init.spec; }
    if (init.status) { this.status = init.status; }
  }


  static emptyObject(): KubeStatefulSet {
    const result = new KubeStatefulSet();
    result.metadata = ObjectMeta.emptyObject();
    result.spec = StatefulSetSpec.emptyObject();
    result.status = StatefulSetStatus.emptyObject();
    return result;
  }

}
