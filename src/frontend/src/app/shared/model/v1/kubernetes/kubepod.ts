/* Do not change, this code is generated from Golang structs */


export class ContainerStateTerminated {
  exitCode: number;
  signal: number;
  reason: string;
  message: string;
  startedAt: Time;
  finishedAt: Time;
  containerID: string;

  constructor(init?: ContainerStateTerminated) {
    if (!init) {
      return;
    }
    if (init.exitCode) {
      this.exitCode = init.exitCode;
    }
    if (init.signal) {
      this.signal = init.signal;
    }
    if (init.reason) {
      this.reason = init.reason;
    }
    if (init.message) {
      this.message = init.message;
    }
    if (init.startedAt) {
      this.startedAt = init.startedAt;
    }
    if (init.finishedAt) {
      this.finishedAt = init.finishedAt;
    }
    if (init.containerID) {
      this.containerID = init.containerID;
    }
  }

}

export class ContainerStateRunning {
  startedAt: Time;

  constructor(init?: ContainerStateRunning) {
    if (!init) {
      return;
    }
    if (init.startedAt) {
      this.startedAt = init.startedAt;
    }
  }

}

export class ContainerStateWaiting {
  reason: string;
  message: string;

  constructor(init?: ContainerStateWaiting) {
    if (!init) {
      return;
    }
    if (init.reason) {
      this.reason = init.reason;
    }
    if (init.message) {
      this.message = init.message;
    }
  }

}

export class ContainerState {
  waiting?: ContainerStateWaiting;
  running?: ContainerStateRunning;
  terminated?: ContainerStateTerminated;

  constructor(init?: ContainerState) {
    if (!init) {
      return;
    }
    if (init.waiting) {
      this.waiting = init.waiting;
    }
    if (init.running) {
      this.running = init.running;
    }
    if (init.terminated) {
      this.terminated = init.terminated;
    }
  }

}

export class ContainerStatus {
  name: string;
  state: ContainerState;
  lastState: ContainerState;
  ready: boolean;
  restartCount: number;
  image: string;
  imageID: string;
  containerID: string;

  constructor(init?: ContainerStatus) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.state) {
      this.state = init.state;
    }
    if (init.lastState) {
      this.lastState = init.lastState;
    }
    if (init.ready) {
      this.ready = init.ready;
    }
    if (init.restartCount) {
      this.restartCount = init.restartCount;
    }
    if (init.image) {
      this.image = init.image;
    }
    if (init.imageID) {
      this.imageID = init.imageID;
    }
    if (init.containerID) {
      this.containerID = init.containerID;
    }
  }

}



export class PodCondition {
  type: string;
  status: string;
  lastProbeTime: Time;
  lastTransitionTime: Time;
  reason: string;
  message: string;

  constructor(init?: PodCondition) {
    if (!init) {
      return;
    }
    if (init.type) {
      this.type = init.type;
    }
    if (init.status) {
      this.status = init.status;
    }
    if (init.lastProbeTime) {
      this.lastProbeTime = init.lastProbeTime;
    }
    if (init.lastTransitionTime) {
      this.lastTransitionTime = init.lastTransitionTime;
    }
    if (init.reason) {
      this.reason = init.reason;
    }
    if (init.message) {
      this.message = init.message;
    }
  }

}

export class PodStatus {
  phase: string;
  conditions: PodCondition[];
  message: string;
  reason: string;
  nominatedNodeName: string;
  hostIP: string;
  podIP: string;
  startTime?: Time;
  initContainerStatuses: ContainerStatus[];
  containerStatuses: ContainerStatus[];
  qosClass: string;

  constructor(init?: PodStatus) {
    if (!init) {
      return;
    }
    if (init.phase) {
      this.phase = init.phase;
    }
    if (init.conditions) {
      this.conditions = init.conditions;
    }
    if (init.message) {
      this.message = init.message;
    }
    if (init.reason) {
      this.reason = init.reason;
    }
    if (init.nominatedNodeName) {
      this.nominatedNodeName = init.nominatedNodeName;
    }
    if (init.hostIP) {
      this.hostIP = init.hostIP;
    }
    if (init.podIP) {
      this.podIP = init.podIP;
    }
    if (init.startTime) {
      this.startTime = init.startTime;
    }
    if (init.initContainerStatuses) {
      this.initContainerStatuses = init.initContainerStatuses;
    }
    if (init.containerStatuses) {
      this.containerStatuses = init.containerStatuses;
    }
    if (init.qosClass) {
      this.qosClass = init.qosClass;
    }
  }

}

export class PodDNSConfigOption {
  name: string;
  value?: string;

  constructor(init?: PodDNSConfigOption) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.value) {
      this.value = init.value;
    }
  }

}

export class PodDNSConfig {
  nameservers: string[];
  searches: string[];
  options: PodDNSConfigOption[];

  constructor(init?: PodDNSConfig) {
    if (!init) {
      return;
    }
    if (init.nameservers) {
      this.nameservers = init.nameservers;
    }
    if (init.searches) {
      this.searches = init.searches;
    }
    if (init.options) {
      this.options = init.options;
    }
  }

}

export class HostAlias {
  ip: string;
  hostnames: string[];

  constructor(init?: HostAlias) {
    if (!init) {
      return;
    }
    if (init.ip) {
      this.ip = init.ip;
    }
    if (init.hostnames) {
      this.hostnames = init.hostnames;
    }
  }

}

export class Toleration {
  key: string;
  operator: string;
  value: string;
  effect: string;
  tolerationSeconds?: number;

  constructor(init?: Toleration) {
    if (!init) {
      return;
    }
    if (init.key) {
      this.key = init.key;
    }
    if (init.operator) {
      this.operator = init.operator;
    }
    if (init.value) {
      this.value = init.value;
    }
    if (init.effect) {
      this.effect = init.effect;
    }
    if (init.tolerationSeconds) {
      this.tolerationSeconds = init.tolerationSeconds;
    }
  }

}


export class PodAntiAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution: WeightedPodAffinityTerm[];

  constructor(init?: PodAntiAffinity) {
    if (!init) {
      return;
    }
    if (init.requiredDuringSchedulingIgnoredDuringExecution) {
      this.requiredDuringSchedulingIgnoredDuringExecution = init.requiredDuringSchedulingIgnoredDuringExecution;
    }
    if (init.preferredDuringSchedulingIgnoredDuringExecution) {
      this.preferredDuringSchedulingIgnoredDuringExecution = init.preferredDuringSchedulingIgnoredDuringExecution;
    }
  }

}

export class WeightedPodAffinityTerm {
  weight: number;
  podAffinityTerm: PodAffinityTerm;

  constructor(init?: WeightedPodAffinityTerm) {
    if (!init) {
      return;
    }
    if (init.weight) {
      this.weight = init.weight;
    }
    if (init.podAffinityTerm) {
      this.podAffinityTerm = init.podAffinityTerm;
    }
  }

}

export class LabelSelectorRequirement {
  key: string;
  operator: string;
  values: string[];

  constructor(init?: LabelSelectorRequirement) {
    if (!init) {
      return;
    }
    if (init.key) {
      this.key = init.key;
    }
    if (init.operator) {
      this.operator = init.operator;
    }
    if (init.values) {
      this.values = init.values;
    }
  }

}

export class LabelSelector {
  matchLabels?: { [key: string]: string };
  matchExpressions: LabelSelectorRequirement[];

  constructor(init?: LabelSelector) {
    if (!init) {
      return;
    }
    if (init.matchLabels) {
      this.matchLabels = init.matchLabels;
    }
    if (init.matchExpressions) {
      this.matchExpressions = init.matchExpressions;
    }
  }

}

export class PodAffinityTerm {
  labelSelector?: LabelSelector;
  namespaces: string[];
  topologyKey: string;

  constructor(init?: PodAffinityTerm) {
    if (!init) {
      return;
    }
    if (init.labelSelector) {
      this.labelSelector = init.labelSelector;
    }
    if (init.namespaces) {
      this.namespaces = init.namespaces;
    }
    if (init.topologyKey) {
      this.topologyKey = init.topologyKey;
    }
  }

}

export class PodAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution: WeightedPodAffinityTerm[];

  constructor(init?: PodAffinity) {
    if (!init) {
      return;
    }
    if (init.requiredDuringSchedulingIgnoredDuringExecution) {
      this.requiredDuringSchedulingIgnoredDuringExecution = init.requiredDuringSchedulingIgnoredDuringExecution;
    }
    if (init.preferredDuringSchedulingIgnoredDuringExecution) {
      this.preferredDuringSchedulingIgnoredDuringExecution = init.preferredDuringSchedulingIgnoredDuringExecution;
    }
  }

}

export class PreferredSchedulingTerm {
  weight: number;
  preference: NodeSelectorTerm;

  constructor(init?: PreferredSchedulingTerm) {
    if (!init) {
      return;
    }
    if (init.weight) {
      this.weight = init.weight;
    }
    if (init.preference) {
      this.preference = init.preference;
    }
  }

}

export class NodeSelectorRequirement {
  key: string;
  operator: string;
  values: string[];

  constructor(init?: NodeSelectorRequirement) {
    if (!init) {
      return;
    }
    if (init.key) {
      this.key = init.key;
    }
    if (init.operator) {
      this.operator = init.operator;
    }
    if (init.values) {
      this.values = init.values;
    }
  }

}

export class NodeSelectorTerm {
  matchExpressions: NodeSelectorRequirement[];

  constructor(init?: NodeSelectorTerm) {
    if (!init) {
      return;
    }
    if (init.matchExpressions) {
      this.matchExpressions = init.matchExpressions;
    }
  }

}

export class NodeSelector {
  nodeSelectorTerms: NodeSelectorTerm[];

  constructor(init?: NodeSelector) {
    if (!init) {
      return;
    }
    if (init.nodeSelectorTerms) {
      this.nodeSelectorTerms = init.nodeSelectorTerms;
    }
  }

}

export class NodeAffinity {
  requiredDuringSchedulingIgnoredDuringExecution?: NodeSelector;
  preferredDuringSchedulingIgnoredDuringExecution: PreferredSchedulingTerm[];

  constructor(init?: NodeAffinity) {
    if (!init) {
      return;
    }
    if (init.requiredDuringSchedulingIgnoredDuringExecution) {
      this.requiredDuringSchedulingIgnoredDuringExecution = init.requiredDuringSchedulingIgnoredDuringExecution;
    }
    if (init.preferredDuringSchedulingIgnoredDuringExecution) {
      this.preferredDuringSchedulingIgnoredDuringExecution = init.preferredDuringSchedulingIgnoredDuringExecution;
    }
  }

}

export class Affinity {
  nodeAffinity?: NodeAffinity;
  podAffinity?: PodAffinity;
  podAntiAffinity?: PodAntiAffinity;

  constructor(init?: Affinity) {
    if (!init) {
      return;
    }
    if (init.nodeAffinity) {
      this.nodeAffinity = init.nodeAffinity;
    }
    if (init.podAffinity) {
      this.podAffinity = init.podAffinity;
    }
    if (init.podAntiAffinity) {
      this.podAntiAffinity = init.podAntiAffinity;
    }
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
    if (!init) {
      return;
    }
    if (init.seLinuxOptions) {
      this.seLinuxOptions = init.seLinuxOptions;
    }
    if (init.runAsUser) {
      this.runAsUser = init.runAsUser;
    }
    if (init.runAsGroup) {
      this.runAsGroup = init.runAsGroup;
    }
    if (init.runAsNonRoot) {
      this.runAsNonRoot = init.runAsNonRoot;
    }
    if (init.supplementalGroups) {
      this.supplementalGroups = init.supplementalGroups;
    }
    if (init.fsGroup) {
      this.fsGroup = init.fsGroup;
    }
  }

}

export class SELinuxOptions {
  user: string;
  role: string;
  type: string;
  level: string;

  constructor(init?: SELinuxOptions) {
    if (!init) {
      return;
    }
    if (init.user) {
      this.user = init.user;
    }
    if (init.role) {
      this.role = init.role;
    }
    if (init.type) {
      this.type = init.type;
    }
    if (init.level) {
      this.level = init.level;
    }
  }

}

export class Capabilities {
  add: string[];
  drop: string[];

  constructor(init?: Capabilities) {
    if (!init) {
      return;
    }
    if (init.add) {
      this.add = init.add;
    }
    if (init.drop) {
      this.drop = init.drop;
    }
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
    if (!init) {
      return;
    }
    if (init.capabilities) {
      this.capabilities = init.capabilities;
    }
    if (init.privileged) {
      this.privileged = init.privileged;
    }
    if (init.seLinuxOptions) {
      this.seLinuxOptions = init.seLinuxOptions;
    }
    if (init.runAsUser) {
      this.runAsUser = init.runAsUser;
    }
    if (init.runAsGroup) {
      this.runAsGroup = init.runAsGroup;
    }
    if (init.runAsNonRoot) {
      this.runAsNonRoot = init.runAsNonRoot;
    }
    if (init.readOnlyRootFilesystem) {
      this.readOnlyRootFilesystem = init.readOnlyRootFilesystem;
    }
    if (init.allowPrivilegeEscalation) {
      this.allowPrivilegeEscalation = init.allowPrivilegeEscalation;
    }
  }

}




export class Handler {
  exec?: ExecAction;
  httpGet?: HTTPGetAction;
  tcpSocket?: TCPSocketAction;

  constructor(init?: Handler) {
    if (!init) {
      return;
    }
    if (init.exec) {
      this.exec = init.exec;
    }
    if (init.httpGet) {
      this.httpGet = init.httpGet;
    }
    if (init.tcpSocket) {
      this.tcpSocket = init.tcpSocket;
    }
  }

}

export class Lifecycle {
  postStart?: Handler;
  preStop?: Handler;

  constructor(init?: Lifecycle) {
    if (!init) {
      return;
    }
    if (init.postStart) {
      this.postStart = init.postStart;
    }
    if (init.preStop) {
      this.preStop = init.preStop;
    }
  }

}


export class TCPSocketAction {
  port: IntOrString;
  host: string;

  constructor(init?: TCPSocketAction) {
    if (!init) {
      return;
    }
    if (init.port) {
      this.port = init.port;
    }
    if (init.host) {
      this.host = init.host;
    }
  }

}

export class HTTPHeader {
  name: string;
  value: string;

  constructor(init?: HTTPHeader) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.value) {
      this.value = init.value;
    }
  }

}

export class IntOrString {
  Type: number;
  IntVal: number;
  StrVal: string;

  constructor(init?: IntOrString) {
    if (!init) {
      return;
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

export class HTTPGetAction {
  path: string;
  port: IntOrString;
  host: string;
  scheme: string;
  httpHeaders: HTTPHeader[];

  constructor(init?: HTTPGetAction) {
    if (!init) {
      return;
    }
    if (init.path) {
      this.path = init.path;
    }
    if (init.port) {
      this.port = init.port;
    }
    if (init.host) {
      this.host = init.host;
    }
    if (init.scheme) {
      this.scheme = init.scheme;
    }
    if (init.httpHeaders) {
      this.httpHeaders = init.httpHeaders;
    }
  }

}

export class ExecAction {
  command: string[];

  constructor(init?: ExecAction) {
    if (!init) {
      return;
    }
    if (init.command) {
      this.command = init.command;
    }
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
    if (!init) {
      return;
    }
    if (init.exec) {
      this.exec = init.exec;
    }
    if (init.httpGet) {
      this.httpGet = init.httpGet;
    }
    if (init.tcpSocket) {
      this.tcpSocket = init.tcpSocket;
    }
    if (init.initialDelaySeconds) {
      this.initialDelaySeconds = init.initialDelaySeconds;
    }
    if (init.timeoutSeconds) {
      this.timeoutSeconds = init.timeoutSeconds;
    }
    if (init.periodSeconds) {
      this.periodSeconds = init.periodSeconds;
    }
    if (init.successThreshold) {
      this.successThreshold = init.successThreshold;
    }
    if (init.failureThreshold) {
      this.failureThreshold = init.failureThreshold;
    }
  }

}

export class VolumeDevice {
  name: string;
  devicePath: string;

  constructor(init?: VolumeDevice) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.devicePath) {
      this.devicePath = init.devicePath;
    }
  }

}

export class VolumeMount {
  name: string;
  readOnly: boolean;
  mountPath: string;
  subPath: string;
  mountPropagation?: string;

  constructor(init?: VolumeMount) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
    if (init.mountPath) {
      this.mountPath = init.mountPath;
    }
    if (init.subPath) {
      this.subPath = init.subPath;
    }
    if (init.mountPropagation) {
      this.mountPropagation = init.mountPropagation;
    }
  }

}

export class ResourceRequirements {
  limits?: { [key: string]: Quantity };
  requests?: { [key: string]: Quantity };

  constructor(init?: ResourceRequirements) {
    if (!init) {
      return;
    }
    if (init.limits) {
      this.limits = init.limits;
    }
    if (init.requests) {
      this.requests = init.requests;
    }
  }

}

export class SecretKeySelector {
  name: string;
  key: string;
  optional?: boolean;

  constructor(init?: SecretKeySelector) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.key) {
      this.key = init.key;
    }
    if (init.optional) {
      this.optional = init.optional;
    }
  }

}

export class ConfigMapKeySelector {
  name: string;
  key: string;
  optional?: boolean;

  constructor(init?: ConfigMapKeySelector) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.key) {
      this.key = init.key;
    }
    if (init.optional) {
      this.optional = init.optional;
    }
  }

}


export class EnvVarSource {
  fieldRef?: ObjectFieldSelector;
  resourceFieldRef?: ResourceFieldSelector;
  configMapKeyRef?: ConfigMapKeySelector;
  secretKeyRef?: SecretKeySelector;

  constructor(init?: EnvVarSource) {
    if (!init) {
      return;
    }
    if (init.fieldRef) {
      this.fieldRef = init.fieldRef;
    }
    if (init.resourceFieldRef) {
      this.resourceFieldRef = init.resourceFieldRef;
    }
    if (init.configMapKeyRef) {
      this.configMapKeyRef = init.configMapKeyRef;
    }
    if (init.secretKeyRef) {
      this.secretKeyRef = init.secretKeyRef;
    }
  }

}

export class EnvVar {
  name: string;
  value: string;
  valueFrom?: EnvVarSource;

  constructor(init?: EnvVar) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.value) {
      this.value = init.value;
    }
    if (init.valueFrom) {
      this.valueFrom = init.valueFrom;
    }
  }

}

export class SecretEnvSource {
  name: string;
  optional?: boolean;

  constructor(init?: SecretEnvSource) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.optional) {
      this.optional = init.optional;
    }
  }

}

export class ConfigMapEnvSource {
  name: string;
  optional?: boolean;

  constructor(init?: ConfigMapEnvSource) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.optional) {
      this.optional = init.optional;
    }
  }

}

export class EnvFromSource {
  prefix: string;
  configMapRef?: ConfigMapEnvSource;
  secretRef?: SecretEnvSource;

  constructor(init?: EnvFromSource) {
    if (!init) {
      return;
    }
    if (init.prefix) {
      this.prefix = init.prefix;
    }
    if (init.configMapRef) {
      this.configMapRef = init.configMapRef;
    }
    if (init.secretRef) {
      this.secretRef = init.secretRef;
    }
  }

}

export class ContainerPort {
  name: string;
  hostPort: number;
  containerPort: number;
  protocol: string;
  hostIP: string;

  constructor(init?: ContainerPort) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.hostPort) {
      this.hostPort = init.hostPort;
    }
    if (init.containerPort) {
      this.containerPort = init.containerPort;
    }
    if (init.protocol) {
      this.protocol = init.protocol;
    }
    if (init.hostIP) {
      this.hostIP = init.hostIP;
    }
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
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.image) {
      this.image = init.image;
    }
    if (init.command) {
      this.command = init.command;
    }
    if (init.args) {
      this.args = init.args;
    }
    if (init.workingDir) {
      this.workingDir = init.workingDir;
    }
    if (init.ports) {
      this.ports = init.ports;
    }
    if (init.envFrom) {
      this.envFrom = init.envFrom;
    }
    if (init.env) {
      this.env = init.env;
    }
    if (init.resources) {
      this.resources = init.resources;
    }
    if (init.volumeMounts) {
      this.volumeMounts = init.volumeMounts;
    }
    if (init.volumeDevices) {
      this.volumeDevices = init.volumeDevices;
    }
    if (init.livenessProbe) {
      this.livenessProbe = init.livenessProbe;
    }
    if (init.readinessProbe) {
      this.readinessProbe = init.readinessProbe;
    }
    if (init.lifecycle) {
      this.lifecycle = init.lifecycle;
    }
    if (init.terminationMessagePath) {
      this.terminationMessagePath = init.terminationMessagePath;
    }
    if (init.terminationMessagePolicy) {
      this.terminationMessagePolicy = init.terminationMessagePolicy;
    }
    if (init.imagePullPolicy) {
      this.imagePullPolicy = init.imagePullPolicy;
    }
    if (init.securityContext) {
      this.securityContext = init.securityContext;
    }
    if (init.stdin) {
      this.stdin = init.stdin;
    }
    if (init.stdinOnce) {
      this.stdinOnce = init.stdinOnce;
    }
    if (init.tty) {
      this.tty = init.tty;
    }
  }

}

export class StorageOSVolumeSource {
  volumeName: string;
  volumeNamespace: string;
  fsType: string;
  readOnly: boolean;
  secretRef?: LocalObjectReference;

  constructor(init?: StorageOSVolumeSource) {
    if (!init) {
      return;
    }
    if (init.volumeName) {
      this.volumeName = init.volumeName;
    }
    if (init.volumeNamespace) {
      this.volumeNamespace = init.volumeNamespace;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
    if (init.secretRef) {
      this.secretRef = init.secretRef;
    }
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
    if (!init) {
      return;
    }
    if (init.gateway) {
      this.gateway = init.gateway;
    }
    if (init.system) {
      this.system = init.system;
    }
    if (init.secretRef) {
      this.secretRef = init.secretRef;
    }
    if (init.sslEnabled) {
      this.sslEnabled = init.sslEnabled;
    }
    if (init.protectionDomain) {
      this.protectionDomain = init.protectionDomain;
    }
    if (init.storagePool) {
      this.storagePool = init.storagePool;
    }
    if (init.storageMode) {
      this.storageMode = init.storageMode;
    }
    if (init.volumeName) {
      this.volumeName = init.volumeName;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class PortworxVolumeSource {
  volumeID: string;
  fsType: string;
  readOnly: boolean;

  constructor(init?: PortworxVolumeSource) {
    if (!init) {
      return;
    }
    if (init.volumeID) {
      this.volumeID = init.volumeID;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class ConfigMapProjection {
  name: string;
  items: KeyToPath[];
  optional?: boolean;

  constructor(init?: ConfigMapProjection) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.items) {
      this.items = init.items;
    }
    if (init.optional) {
      this.optional = init.optional;
    }
  }

}

export class DownwardAPIProjection {
  items: DownwardAPIVolumeFile[];

  constructor(init?: DownwardAPIProjection) {
    if (!init) {
      return;
    }
    if (init.items) {
      this.items = init.items;
    }
  }

}

export class SecretProjection {
  name: string;
  items: KeyToPath[];
  optional?: boolean;

  constructor(init?: SecretProjection) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.items) {
      this.items = init.items;
    }
    if (init.optional) {
      this.optional = init.optional;
    }
  }

}

export class VolumeProjection {
  secret?: SecretProjection;
  downwardAPI?: DownwardAPIProjection;
  configMap?: ConfigMapProjection;

  constructor(init?: VolumeProjection) {
    if (!init) {
      return;
    }
    if (init.secret) {
      this.secret = init.secret;
    }
    if (init.downwardAPI) {
      this.downwardAPI = init.downwardAPI;
    }
    if (init.configMap) {
      this.configMap = init.configMap;
    }
  }

}

export class ProjectedVolumeSource {
  sources: VolumeProjection[];
  defaultMode?: number;

  constructor(init?: ProjectedVolumeSource) {
    if (!init) {
      return;
    }
    if (init.sources) {
      this.sources = init.sources;
    }
    if (init.defaultMode) {
      this.defaultMode = init.defaultMode;
    }
  }

}

export class PhotonPersistentDiskVolumeSource {
  pdID: string;
  fsType: string;

  constructor(init?: PhotonPersistentDiskVolumeSource) {
    if (!init) {
      return;
    }
    if (init.pdID) {
      this.pdID = init.pdID;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
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
    if (!init) {
      return;
    }
    if (init.diskName) {
      this.diskName = init.diskName;
    }
    if (init.diskURI) {
      this.diskURI = init.diskURI;
    }
    if (init.cachingMode) {
      this.cachingMode = init.cachingMode;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
    if (init.kind) {
      this.kind = init.kind;
    }
  }

}

export class QuobyteVolumeSource {
  registry: string;
  volume: string;
  readOnly: boolean;
  user: string;
  group: string;

  constructor(init?: QuobyteVolumeSource) {
    if (!init) {
      return;
    }
    if (init.registry) {
      this.registry = init.registry;
    }
    if (init.volume) {
      this.volume = init.volume;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
    if (init.user) {
      this.user = init.user;
    }
    if (init.group) {
      this.group = init.group;
    }
  }

}

export class VsphereVirtualDiskVolumeSource {
  volumePath: string;
  fsType: string;
  storagePolicyName: string;
  storagePolicyID: string;

  constructor(init?: VsphereVirtualDiskVolumeSource) {
    if (!init) {
      return;
    }
    if (init.volumePath) {
      this.volumePath = init.volumePath;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.storagePolicyName) {
      this.storagePolicyName = init.storagePolicyName;
    }
    if (init.storagePolicyID) {
      this.storagePolicyID = init.storagePolicyID;
    }
  }

}

export class ConfigMapVolumeSource {
  name: string;
  items: KeyToPath[];
  defaultMode?: number;
  optional?: boolean;

  constructor(init?: ConfigMapVolumeSource) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.items) {
      this.items = init.items;
    }
    if (init.defaultMode) {
      this.defaultMode = init.defaultMode;
    }
    if (init.optional) {
      this.optional = init.optional;
    }
  }

}

export class AzureFileVolumeSource {
  secretName: string;
  shareName: string;
  readOnly: boolean;

  constructor(init?: AzureFileVolumeSource) {
    if (!init) {
      return;
    }
    if (init.secretName) {
      this.secretName = init.secretName;
    }
    if (init.shareName) {
      this.shareName = init.shareName;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class FCVolumeSource {
  targetWWNs: string[];
  lun?: number;
  fsType: string;
  readOnly: boolean;
  wwids: string[];

  constructor(init?: FCVolumeSource) {
    if (!init) {
      return;
    }
    if (init.targetWWNs) {
      this.targetWWNs = init.targetWWNs;
    }
    if (init.lun) {
      this.lun = init.lun;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
    if (init.wwids) {
      this.wwids = init.wwids;
    }
  }

}

export class ResourceFieldSelector {
  containerName: string;
  resource: string;
  divisor: Quantity;

  constructor(init?: ResourceFieldSelector) {
    if (!init) {
      return;
    }
    if (init.containerName) {
      this.containerName = init.containerName;
    }
    if (init.resource) {
      this.resource = init.resource;
    }
    if (init.divisor) {
      this.divisor = init.divisor;
    }
  }

}

export class ObjectFieldSelector {
  apiVersion: string;
  fieldPath: string;

  constructor(init?: ObjectFieldSelector) {
    if (!init) {
      return;
    }
    if (init.apiVersion) {
      this.apiVersion = init.apiVersion;
    }
    if (init.fieldPath) {
      this.fieldPath = init.fieldPath;
    }
  }

}

export class DownwardAPIVolumeFile {
  path: string;
  fieldRef?: ObjectFieldSelector;
  resourceFieldRef?: ResourceFieldSelector;
  mode?: number;

  constructor(init?: DownwardAPIVolumeFile) {
    if (!init) {
      return;
    }
    if (init.path) {
      this.path = init.path;
    }
    if (init.fieldRef) {
      this.fieldRef = init.fieldRef;
    }
    if (init.resourceFieldRef) {
      this.resourceFieldRef = init.resourceFieldRef;
    }
    if (init.mode) {
      this.mode = init.mode;
    }
  }

}

export class DownwardAPIVolumeSource {
  items: DownwardAPIVolumeFile[];
  defaultMode?: number;

  constructor(init?: DownwardAPIVolumeSource) {
    if (!init) {
      return;
    }
    if (init.items) {
      this.items = init.items;
    }
    if (init.defaultMode) {
      this.defaultMode = init.defaultMode;
    }
  }

}

export class FlockerVolumeSource {
  datasetName: string;
  datasetUUID: string;

  constructor(init?: FlockerVolumeSource) {
    if (!init) {
      return;
    }
    if (init.datasetName) {
      this.datasetName = init.datasetName;
    }
    if (init.datasetUUID) {
      this.datasetUUID = init.datasetUUID;
    }
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
    if (!init) {
      return;
    }
    if (init.monitors) {
      this.monitors = init.monitors;
    }
    if (init.path) {
      this.path = init.path;
    }
    if (init.user) {
      this.user = init.user;
    }
    if (init.secretFile) {
      this.secretFile = init.secretFile;
    }
    if (init.secretRef) {
      this.secretRef = init.secretRef;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class CinderVolumeSource {
  volumeID: string;
  fsType: string;
  readOnly: boolean;

  constructor(init?: CinderVolumeSource) {
    if (!init) {
      return;
    }
    if (init.volumeID) {
      this.volumeID = init.volumeID;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class FlexVolumeSource {
  driver: string;
  fsType: string;
  secretRef?: LocalObjectReference;
  readOnly: boolean;
  options?: { [key: string]: string };

  constructor(init?: FlexVolumeSource) {
    if (!init) {
      return;
    }
    if (init.driver) {
      this.driver = init.driver;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.secretRef) {
      this.secretRef = init.secretRef;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
    if (init.options) {
      this.options = init.options;
    }
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
    if (!init) {
      return;
    }
    if (init.monitors) {
      this.monitors = init.monitors;
    }
    if (init.image) {
      this.image = init.image;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.pool) {
      this.pool = init.pool;
    }
    if (init.user) {
      this.user = init.user;
    }
    if (init.keyring) {
      this.keyring = init.keyring;
    }
    if (init.secretRef) {
      this.secretRef = init.secretRef;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class PersistentVolumeClaimVolumeSource {
  claimName: string;
  readOnly: boolean;

  constructor(init?: PersistentVolumeClaimVolumeSource) {
    if (!init) {
      return;
    }
    if (init.claimName) {
      this.claimName = init.claimName;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class GlusterfsVolumeSource {
  endpoints: string;
  path: string;
  readOnly: boolean;

  constructor(init?: GlusterfsVolumeSource) {
    if (!init) {
      return;
    }
    if (init.endpoints) {
      this.endpoints = init.endpoints;
    }
    if (init.path) {
      this.path = init.path;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class LocalObjectReference {
  name: string;

  constructor(init?: LocalObjectReference) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
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
    if (!init) {
      return;
    }
    if (init.targetPortal) {
      this.targetPortal = init.targetPortal;
    }
    if (init.iqn) {
      this.iqn = init.iqn;
    }
    if (init.lun) {
      this.lun = init.lun;
    }
    if (init.iscsiInterface) {
      this.iscsiInterface = init.iscsiInterface;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
    if (init.portals) {
      this.portals = init.portals;
    }
    if (init.chapAuthDiscovery) {
      this.chapAuthDiscovery = init.chapAuthDiscovery;
    }
    if (init.chapAuthSession) {
      this.chapAuthSession = init.chapAuthSession;
    }
    if (init.secretRef) {
      this.secretRef = init.secretRef;
    }
    if (init.initiatorName) {
      this.initiatorName = init.initiatorName;
    }
  }

}

export class NFSVolumeSource {
  server: string;
  path: string;
  readOnly: boolean;

  constructor(init?: NFSVolumeSource) {
    if (!init) {
      return;
    }
    if (init.server) {
      this.server = init.server;
    }
    if (init.path) {
      this.path = init.path;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class KeyToPath {
  key: string;
  path: string;
  mode?: number;

  constructor(init?: KeyToPath) {
    if (!init) {
      return;
    }
    if (init.key) {
      this.key = init.key;
    }
    if (init.path) {
      this.path = init.path;
    }
    if (init.mode) {
      this.mode = init.mode;
    }
  }

}

export class SecretVolumeSource {
  secretName: string;
  items: KeyToPath[];
  defaultMode?: number;
  optional?: boolean;

  constructor(init?: SecretVolumeSource) {
    if (!init) {
      return;
    }
    if (init.secretName) {
      this.secretName = init.secretName;
    }
    if (init.items) {
      this.items = init.items;
    }
    if (init.defaultMode) {
      this.defaultMode = init.defaultMode;
    }
    if (init.optional) {
      this.optional = init.optional;
    }
  }

}

export class GitRepoVolumeSource {
  repository: string;
  revision: string;
  directory: string;

  constructor(init?: GitRepoVolumeSource) {
    if (!init) {
      return;
    }
    if (init.repository) {
      this.repository = init.repository;
    }
    if (init.revision) {
      this.revision = init.revision;
    }
    if (init.directory) {
      this.directory = init.directory;
    }
  }

}

export class AWSElasticBlockStoreVolumeSource {
  volumeID: string;
  fsType: string;
  partition: number;
  readOnly: boolean;

  constructor(init?: AWSElasticBlockStoreVolumeSource) {
    if (!init) {
      return;
    }
    if (init.volumeID) {
      this.volumeID = init.volumeID;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.partition) {
      this.partition = init.partition;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class GCEPersistentDiskVolumeSource {
  pdName: string;
  fsType: string;
  partition: number;
  readOnly: boolean;

  constructor(init?: GCEPersistentDiskVolumeSource) {
    if (!init) {
      return;
    }
    if (init.pdName) {
      this.pdName = init.pdName;
    }
    if (init.fsType) {
      this.fsType = init.fsType;
    }
    if (init.partition) {
      this.partition = init.partition;
    }
    if (init.readOnly) {
      this.readOnly = init.readOnly;
    }
  }

}

export class Quantity {
  Format: string;

  constructor(init?: Quantity) {
    if (!init) {
      return;
    }
    if (init.Format) {
      this.Format = init.Format;
    }
  }

}

export class EmptyDirVolumeSource {
  medium: string;
  sizeLimit?: Quantity;

  constructor(init?: EmptyDirVolumeSource) {
    if (!init) {
      return;
    }
    if (init.medium) {
      this.medium = init.medium;
    }
    if (init.sizeLimit) {
      this.sizeLimit = init.sizeLimit;
    }
  }

}

export class HostPathVolumeSource {
  path: string;
  type?: string;

  constructor(init?: HostPathVolumeSource) {
    if (!init) {
      return;
    }
    if (init.path) {
      this.path = init.path;
    }
    if (init.type) {
      this.type = init.type;
    }
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
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
    if (init.hostPath) {
      this.hostPath = init.hostPath;
    }
    if (init.emptyDir) {
      this.emptyDir = init.emptyDir;
    }
    if (init.gcePersistentDisk) {
      this.gcePersistentDisk = init.gcePersistentDisk;
    }
    if (init.awsElasticBlockStore) {
      this.awsElasticBlockStore = init.awsElasticBlockStore;
    }
    if (init.gitRepo) {
      this.gitRepo = init.gitRepo;
    }
    if (init.secret) {
      this.secret = init.secret;
    }
    if (init.nfs) {
      this.nfs = init.nfs;
    }
    if (init.iscsi) {
      this.iscsi = init.iscsi;
    }
    if (init.glusterfs) {
      this.glusterfs = init.glusterfs;
    }
    if (init.persistentVolumeClaim) {
      this.persistentVolumeClaim = init.persistentVolumeClaim;
    }
    if (init.rbd) {
      this.rbd = init.rbd;
    }
    if (init.flexVolume) {
      this.flexVolume = init.flexVolume;
    }
    if (init.cinder) {
      this.cinder = init.cinder;
    }
    if (init.cephfs) {
      this.cephfs = init.cephfs;
    }
    if (init.flocker) {
      this.flocker = init.flocker;
    }
    if (init.downwardAPI) {
      this.downwardAPI = init.downwardAPI;
    }
    if (init.fc) {
      this.fc = init.fc;
    }
    if (init.azureFile) {
      this.azureFile = init.azureFile;
    }
    if (init.configMap) {
      this.configMap = init.configMap;
    }
    if (init.vsphereVolume) {
      this.vsphereVolume = init.vsphereVolume;
    }
    if (init.quobyte) {
      this.quobyte = init.quobyte;
    }
    if (init.azureDisk) {
      this.azureDisk = init.azureDisk;
    }
    if (init.photonPersistentDisk) {
      this.photonPersistentDisk = init.photonPersistentDisk;
    }
    if (init.projected) {
      this.projected = init.projected;
    }
    if (init.portworxVolume) {
      this.portworxVolume = init.portworxVolume;
    }
    if (init.scaleIO) {
      this.scaleIO = init.scaleIO;
    }
    if (init.storageos) {
      this.storageos = init.storageos;
    }
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
    if (!init) {
      return;
    }
    if (init.volumes) {
      this.volumes = init.volumes;
    }
    if (init.initContainers) {
      this.initContainers = init.initContainers;
    }
    if (init.containers) {
      this.containers = init.containers;
    }
    if (init.restartPolicy) {
      this.restartPolicy = init.restartPolicy;
    }
    if (init.terminationGracePeriodSeconds) {
      this.terminationGracePeriodSeconds = init.terminationGracePeriodSeconds;
    }
    if (init.activeDeadlineSeconds) {
      this.activeDeadlineSeconds = init.activeDeadlineSeconds;
    }
    if (init.dnsPolicy) {
      this.dnsPolicy = init.dnsPolicy;
    }
    if (init.nodeSelector) {
      this.nodeSelector = init.nodeSelector;
    }
    if (init.serviceAccountName) {
      this.serviceAccountName = init.serviceAccountName;
    }
    if (init.serviceAccount) {
      this.serviceAccount = init.serviceAccount;
    }
    if (init.automountServiceAccountToken) {
      this.automountServiceAccountToken = init.automountServiceAccountToken;
    }
    if (init.nodeName) {
      this.nodeName = init.nodeName;
    }
    if (init.hostNetwork) {
      this.hostNetwork = init.hostNetwork;
    }
    if (init.hostPID) {
      this.hostPID = init.hostPID;
    }
    if (init.hostIPC) {
      this.hostIPC = init.hostIPC;
    }
    if (init.shareProcessNamespace) {
      this.shareProcessNamespace = init.shareProcessNamespace;
    }
    if (init.securityContext) {
      this.securityContext = init.securityContext;
    }
    if (init.imagePullSecrets) {
      this.imagePullSecrets = init.imagePullSecrets;
    }
    if (init.hostname) {
      this.hostname = init.hostname;
    }
    if (init.subdomain) {
      this.subdomain = init.subdomain;
    }
    if (init.affinity) {
      this.affinity = init.affinity;
    }
    if (init.schedulerName) {
      this.schedulerName = init.schedulerName;
    }
    if (init.tolerations) {
      this.tolerations = init.tolerations;
    }
    if (init.hostAliases) {
      this.hostAliases = init.hostAliases;
    }
    if (init.priorityClassName) {
      this.priorityClassName = init.priorityClassName;
    }
    if (init.priority) {
      this.priority = init.priority;
    }
    if (init.dnsConfig) {
      this.dnsConfig = init.dnsConfig;
    }
  }

}

export class StatusCause {
  reason: string;
  message: string;
  field: string;

  constructor(init?: StatusCause) {
    if (!init) {
      return;
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

  constructor(init?: StatusDetails) {
    if (!init) {
      return;
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

  constructor(init?: ListMeta) {
    if (!init) {
      return;
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

  constructor(init?: Status) {
    if (!init) {
      return;
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

  constructor(init?: Initializer) {
    if (!init) {
      return;
    }
    if (init.name) {
      this.name = init.name;
    }
  }

}

export class Initializers {
  pending: Initializer[];
  result?: Status;

  constructor(init?: Initializers) {
    if (!init) {
      return;
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
  blockOwnerDeletion?: boolean;

  constructor(init?: OwnerReference) {
    if (!init) {
      return;
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

}


export class Time {
  Time: Date;

  constructor(init?: Time) {
    if (!init) {
      return;
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
  deletionTimestamp?: Time;
  deletionGracePeriodSeconds?: number;
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
  ownerReferences: OwnerReference[];
  initializers?: Initializers;
  finalizers: string[];
  clusterName: string;

  constructor(init?: ObjectMeta) {
    if (!init) {
      return;
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

}

export class KubePod {
  kind: string;
  apiVersion: string;
  metadata: ObjectMeta;
  spec: PodSpec;
  status: PodStatus;

  constructor(init?: KubePod) {
    if (!init) {
      return;
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
