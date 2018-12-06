/* Do not change, this code is generated from Golang structs */


export class JobCondition {
  type: string;
  status: string;
  lastProbeTime: Time;
  lastTransitionTime: Time;
  reason: string;
  message: string;
  //[JobCondition:]


  //[end]
}

export class JobStatus {
  conditions: JobCondition[];
  startTime: Time;
  completionTime: Time;
  active: number;
  succeeded: number;
  failed: number;
  //[JobStatus:]


  //[end]
}

export class HostAlias {
  ip: string;
  hostnames: string[];
  //[HostAlias:]


  //[end]
}

export class Toleration {
  key: string;
  operator: string;
  value: string;
  effect: string;
  tolerationSeconds: number;
  //[Toleration:]


  //[end]
}


export class PodAntiAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution: WeightedPodAffinityTerm[];
  //[PodAntiAffinity:]


  //[end]
}

export class WeightedPodAffinityTerm {
  weight: number;
  podAffinityTerm: PodAffinityTerm;
  //[WeightedPodAffinityTerm:]


  //[end]
}

export class PodAffinityTerm {
  labelSelector: LabelSelector;
  namespaces: string[];
  topologyKey: string;
  //[PodAffinityTerm:]


  //[end]
}

export class PodAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution: WeightedPodAffinityTerm[];
  //[PodAffinity:]


  //[end]
}

export class PreferredSchedulingTerm {
  weight: number;
  preference: NodeSelectorTerm;
  //[PreferredSchedulingTerm:]


  //[end]
}

export class NodeSelectorRequirement {
  key: string;
  operator: string;
  values: string[];
  //[NodeSelectorRequirement:]


  //[end]
}

export class NodeSelectorTerm {
  matchExpressions: NodeSelectorRequirement[];
  //[NodeSelectorTerm:]


  //[end]
}

export class NodeSelector {
  nodeSelectorTerms: NodeSelectorTerm[];
  //[NodeSelector:]


  //[end]
}

export class NodeAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: NodeSelector;
  preferredDuringSchedulingIgnoredDuringExecution: PreferredSchedulingTerm[];
  //[NodeAffinity:]


  //[end]
}

export class Affinity {
  nodeAffinity: NodeAffinity;
  podAffinity: PodAffinity;
  podAntiAffinity: PodAntiAffinity;
  //[Affinity:]


  //[end]
}


export class PodSecurityContext {
  seLinuxOptions: SELinuxOptions;
  runAsUser: number;
  runAsNonRoot: boolean;
  supplementalGroups: number[];
  fsGroup: number;
  //[PodSecurityContext:]


  //[end]
}

export class SELinuxOptions {
  user: string;
  role: string;
  type: string;
  level: string;
  //[SELinuxOptions:]


  //[end]
}

export class Capabilities {
  add: string[];
  drop: string[];
  //[Capabilities:]


  //[end]
}

export class SecurityContext {
  capabilities: Capabilities;
  privileged: boolean;
  seLinuxOptions: SELinuxOptions;
  runAsUser: number;
  runAsNonRoot: boolean;
  readOnlyRootFilesystem: boolean;
  //[SecurityContext:]


  //[end]
}




export class Handler {
  exec: ExecAction;
  httpGet: HTTPGetAction;
  tcpSocket: TCPSocketAction;
  //[Handler:]


  //[end]
}

export class Lifecycle {
  postStart: Handler;
  preStop: Handler;
  //[Lifecycle:]


  //[end]
}


export class TCPSocketAction {
  port: IntOrString;
  host: string;
  //[TCPSocketAction:]


  //[end]
}

export class HTTPHeader {
  name: string;
  value: string;
  //[HTTPHeader:]


  //[end]
}

export class IntOrString {
  //[IntOrString:]


  //[end]
}

export class HTTPGetAction {
  path: string;
  port: IntOrString;
  host: string;
  scheme: string;
  httpHeaders: HTTPHeader[];
  //[HTTPGetAction:]


  //[end]
}

export class ExecAction {
  command: string[];
  //[ExecAction:]


  //[end]
}

export class Probe {
  exec: ExecAction;
  httpGet: HTTPGetAction;
  tcpSocket: TCPSocketAction;
  initialDelaySeconds: number;
  timeoutSeconds: number;
  periodSeconds: number;
  successThreshold: number;
  failureThreshold: number;
  //[Probe:]


  //[end]
}

export class VolumeMount {
  name: string;
  readOnly: boolean;
  mountPath: string;
  subPath: string;
  //[VolumeMount:]


  //[end]
}

export class ResourceRequirements {
  limits: {};
  requests: {};
  //[ResourceRequirements:]


  //[end]
}

export class SecretKeySelector {
  name: string;
  key: string;
  optional: boolean;
  //[SecretKeySelector:]


  //[end]
}

export class ConfigMapKeySelector {
  name: string;
  key: string;
  optional: boolean;
  //[ConfigMapKeySelector:]


  //[end]
}


export class EnvVarSource {
  fieldRef: ObjectFieldSelector;
  resourceFieldRef: ResourceFieldSelector;
  configMapKeyRef: ConfigMapKeySelector;
  secretKeyRef: SecretKeySelector;
  //[EnvVarSource:]


  //[end]
}

export class EnvVar {
  name: string;
  value: string;
  valueFrom: EnvVarSource;
  //[EnvVar:]


  //[end]
}

export class SecretEnvSource {
  name: string;
  optional: boolean;
  //[SecretEnvSource:]


  //[end]
}

export class ConfigMapEnvSource {
  name: string;
  optional: boolean;
  //[ConfigMapEnvSource:]


  //[end]
}

export class EnvFromSource {
  prefix: string;
  configMapRef: ConfigMapEnvSource;
  secretRef: SecretEnvSource;
  //[EnvFromSource:]


  //[end]
}

export class ContainerPort {
  name: string;
  hostPort: number;
  containerPort: number;
  protocol: string;
  hostIP: string;
  //[ContainerPort:]


  //[end]
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
  livenessProbe: Probe;
  readinessProbe: Probe;
  lifecycle: Lifecycle;
  terminationMessagePath: string;
  terminationMessagePolicy: string;
  imagePullPolicy: string;
  securityContext: SecurityContext;
  stdin: boolean;
  stdinOnce: boolean;
  tty: boolean;
  //[Container:]


  //[end]
}

export class StorageOSVolumeSource {
  volumeName: string;
  volumeNamespace: string;
  fsType: string;
  readOnly: boolean;
  secretRef: LocalObjectReference;
  //[StorageOSVolumeSource:]


  //[end]
}

export class ScaleIOVolumeSource {
  gateway: string;
  system: string;
  secretRef: LocalObjectReference;
  sslEnabled: boolean;
  protectionDomain: string;
  storagePool: string;
  storageMode: string;
  volumeName: string;
  fsType: string;
  readOnly: boolean;
  //[ScaleIOVolumeSource:]


  //[end]
}

export class PortworxVolumeSource {
  volumeID: string;
  fsType: string;
  readOnly: boolean;
  //[PortworxVolumeSource:]


  //[end]
}

export class ConfigMapProjection {
  name: string;
  items: KeyToPath[];
  optional: boolean;
  //[ConfigMapProjection:]


  //[end]
}

export class DownwardAPIProjection {
  items: DownwardAPIVolumeFile[];
  //[DownwardAPIProjection:]


  //[end]
}

export class SecretProjection {
  name: string;
  items: KeyToPath[];
  optional: boolean;
  //[SecretProjection:]


  //[end]
}

export class VolumeProjection {
  secret: SecretProjection;
  downwardAPI: DownwardAPIProjection;
  configMap: ConfigMapProjection;
  //[VolumeProjection:]


  //[end]
}

export class ProjectedVolumeSource {
  sources: VolumeProjection[];
  defaultMode: number;
  //[ProjectedVolumeSource:]


  //[end]
}

export class PhotonPersistentDiskVolumeSource {
  pdID: string;
  fsType: string;
  //[PhotonPersistentDiskVolumeSource:]


  //[end]
}

export class AzureDiskVolumeSource {
  diskName: string;
  diskURI: string;
  cachingMode: string;
  fsType: string;
  readOnly: boolean;
  kind: string;
  //[AzureDiskVolumeSource:]


  //[end]
}

export class QuobyteVolumeSource {
  registry: string;
  volume: string;
  readOnly: boolean;
  user: string;
  group: string;
  //[QuobyteVolumeSource:]


  //[end]
}

export class VsphereVirtualDiskVolumeSource {
  volumePath: string;
  fsType: string;
  storagePolicyName: string;
  storagePolicyID: string;
  //[VsphereVirtualDiskVolumeSource:]


  //[end]
}

export class ConfigMapVolumeSource {
  name: string;
  items: KeyToPath[];
  defaultMode: number;
  optional: boolean;
  //[ConfigMapVolumeSource:]


  //[end]
}

export class AzureFileVolumeSource {
  secretName: string;
  shareName: string;
  readOnly: boolean;
  //[AzureFileVolumeSource:]


  //[end]
}

export class FCVolumeSource {
  targetWWNs: string[];
  lun: number;
  fsType: string;
  readOnly: boolean;
  //[FCVolumeSource:]


  //[end]
}

export class ResourceFieldSelector {
  containerName: string;
  resource: string;
  divisor: Quantity;
  //[ResourceFieldSelector:]


  //[end]
}

export class ObjectFieldSelector {
  apiVersion: string;
  fieldPath: string;
  //[ObjectFieldSelector:]


  //[end]
}

export class DownwardAPIVolumeFile {
  path: string;
  fieldRef: ObjectFieldSelector;
  resourceFieldRef: ResourceFieldSelector;
  mode: number;
  //[DownwardAPIVolumeFile:]


  //[end]
}

export class DownwardAPIVolumeSource {
  items: DownwardAPIVolumeFile[];
  defaultMode: number;
  //[DownwardAPIVolumeSource:]


  //[end]
}

export class FlockerVolumeSource {
  datasetName: string;
  datasetUUID: string;
  //[FlockerVolumeSource:]


  //[end]
}

export class CephFSVolumeSource {
  monitors: string[];
  path: string;
  user: string;
  secretFile: string;
  secretRef: LocalObjectReference;
  readOnly: boolean;
  //[CephFSVolumeSource:]


  //[end]
}

export class CinderVolumeSource {
  volumeID: string;
  fsType: string;
  readOnly: boolean;
  //[CinderVolumeSource:]


  //[end]
}

export class FlexVolumeSource {
  driver: string;
  fsType: string;
  secretRef: LocalObjectReference;
  readOnly: boolean;
  options: {};
  //[FlexVolumeSource:]


  //[end]
}

export class RBDVolumeSource {
  monitors: string[];
  image: string;
  fsType: string;
  pool: string;
  user: string;
  keyring: string;
  secretRef: LocalObjectReference;
  readOnly: boolean;
  //[RBDVolumeSource:]


  //[end]
}

export class PersistentVolumeClaimVolumeSource {
  claimName: string;
  readOnly: boolean;
  //[PersistentVolumeClaimVolumeSource:]


  //[end]
}

export class GlusterfsVolumeSource {
  endpoints: string;
  path: string;
  readOnly: boolean;
  //[GlusterfsVolumeSource:]


  //[end]
}

export class LocalObjectReference {
  name: string;
  //[LocalObjectReference:]


  //[end]
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
  secretRef: LocalObjectReference;
  //[ISCSIVolumeSource:]


  //[end]
}

export class NFSVolumeSource {
  server: string;
  path: string;
  readOnly: boolean;
  //[NFSVolumeSource:]


  //[end]
}

export class KeyToPath {
  key: string;
  path: string;
  mode: number;
  //[KeyToPath:]


  //[end]
}

export class SecretVolumeSource {
  secretName: string;
  items: KeyToPath[];
  defaultMode: number;
  optional: boolean;
  //[SecretVolumeSource:]


  //[end]
}

export class GitRepoVolumeSource {
  repository: string;
  revision: string;
  directory: string;
  //[GitRepoVolumeSource:]


  //[end]
}

export class AWSElasticBlockStoreVolumeSource {
  volumeID: string;
  fsType: string;
  partition: number;
  readOnly: boolean;
  //[AWSElasticBlockStoreVolumeSource:]


  //[end]
}

export class GCEPersistentDiskVolumeSource {
  pdName: string;
  fsType: string;
  partition: number;
  readOnly: boolean;
  //[GCEPersistentDiskVolumeSource:]


  //[end]
}

export class Quantity {
  //[Quantity:]


  //[end]
}

export class EmptyDirVolumeSource {
  medium: string;
  sizeLimit: Quantity;
  //[EmptyDirVolumeSource:]


  //[end]
}

export class HostPathVolumeSource {
  path: string;
  //[HostPathVolumeSource:]


  //[end]
}

export class Volume {
  name: string;
  hostPath: HostPathVolumeSource;
  emptyDir: EmptyDirVolumeSource;
  gcePersistentDisk: GCEPersistentDiskVolumeSource;
  awsElasticBlockStore: AWSElasticBlockStoreVolumeSource;
  gitRepo: GitRepoVolumeSource;
  secret: SecretVolumeSource;
  nfs: NFSVolumeSource;
  iscsi: ISCSIVolumeSource;
  glusterfs: GlusterfsVolumeSource;
  persistentVolumeClaim: PersistentVolumeClaimVolumeSource;
  rbd: RBDVolumeSource;
  flexVolume: FlexVolumeSource;
  cinder: CinderVolumeSource;
  cephfs: CephFSVolumeSource;
  flocker: FlockerVolumeSource;
  downwardAPI: DownwardAPIVolumeSource;
  fc: FCVolumeSource;
  azureFile: AzureFileVolumeSource;
  configMap: ConfigMapVolumeSource;
  vsphereVolume: VsphereVirtualDiskVolumeSource;
  quobyte: QuobyteVolumeSource;
  azureDisk: AzureDiskVolumeSource;
  photonPersistentDisk: PhotonPersistentDiskVolumeSource;
  projected: ProjectedVolumeSource;
  portworxVolume: PortworxVolumeSource;
  scaleIO: ScaleIOVolumeSource;
  storageos: StorageOSVolumeSource;
  //[Volume:]


  //[end]
}

export class PodSpec {
  volumes: Volume[];
  initContainers: Container[];
  containers: Container[];
  restartPolicy: string;
  terminationGracePeriodSeconds: number;
  activeDeadlineSeconds: number;
  dnsPolicy: string;
  nodeSelector: {};
  serviceAccountName: string;
  serviceAccount: string;
  automountServiceAccountToken: boolean;
  nodeName: string;
  hostNetwork: boolean;
  hostPID: boolean;
  hostIPC: boolean;
  securityContext: PodSecurityContext;
  imagePullSecrets: LocalObjectReference[];
  hostname: string;
  subdomain: string;
  affinity: Affinity;
  schedulerName: string;
  tolerations: Toleration[];
  hostAliases: HostAlias[];
  //[PodSpec:]


  //[end]
}

export class PodTemplateSpec {
  metadata: ObjectMeta;
  spec: PodSpec;
  //[PodTemplateSpec:]


  //[end]
}

export class LabelSelectorRequirement {
  key: string;
  operator: string;
  values: string[];
  //[LabelSelectorRequirement:]


  //[end]
}

export class LabelSelector {
  matchLabels: {};
  matchExpressions: LabelSelectorRequirement[];
  //[LabelSelector:]


  //[end]
}

export class JobSpec {
  parallelism: number;
  completions: number;
  activeDeadlineSeconds: number;
  selector: LabelSelector;
  manualSelector: boolean;
  template: PodTemplateSpec;
  //[JobSpec:]


  //[end]
}

export class StatusCause {
  reason: string;
  message: string;
  field: string;
  //[StatusCause:]


  //[end]
}

export class StatusDetails {
  name: string;
  group: string;
  kind: string;
  uid: string;
  causes: StatusCause[];
  retryAfterSeconds: number;
  //[StatusDetails:]


  //[end]
}

export class ListMeta {
  selfLink: string;
  resourceVersion: string;
  //[ListMeta:]


  //[end]
}

export class Status {
  kind: string;
  apiVersion: string;
  metadata: ListMeta;
  status: string;
  message: string;
  reason: string;
  details: StatusDetails;
  code: number;
  //[Status:]


  //[end]
}

export class Initializer {
  name: string;
  //[Initializer:]


  //[end]
}

export class Initializers {
  pending: Initializer[];
  result: Status;
  //[Initializers:]


  //[end]
}

export class OwnerReference {
  apiVersion: string;
  kind: string;
  name: string;
  uid: string;
  controller: boolean;
  blockOwnerDeletion: boolean;
  //[OwnerReference:]


  //[end]
}

export class Time {
  //[Time:]


  //[end]
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
  deletionTimestamp: Time;
  deletionGracePeriodSeconds: number;
  labels: {};
  annotations: {};
  ownerReferences: OwnerReference[];
  initializers: Initializers;
  finalizers: string[];
  clusterName: string;
  //[ObjectMeta:]


  //[end]
}

export class KubeJob {
  kind: string;
  apiVersion: string;
  metadata: ObjectMeta;
  spec: JobSpec;
  status: JobStatus;
  //[Job:]


  //[end]
}
