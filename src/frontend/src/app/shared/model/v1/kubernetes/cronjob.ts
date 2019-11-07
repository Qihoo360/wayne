/* Do not change, this code is generated from Golang structs */


export class ObjectReference {
  kind: string;
  namespace: string;
  name: string;
  uid: string;
  apiVersion: string;
  resourceVersion: string;
  fieldPath: string;
}

export class CronJobStatus {
  active: ObjectReference[];
  lastScheduleTime: Time;
}

export class HostAlias {
  ip: string;
  hostnames: string[];
}

export class Toleration {
  key: string;
  operator: string;
  value: string;
  effect: string;
  tolerationSeconds: number;
}


export class PodAntiAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution: WeightedPodAffinityTerm[];
}

export class WeightedPodAffinityTerm {
  weight: number;
  podAffinityTerm: PodAffinityTerm;
}

export class PodAffinityTerm {
  labelSelector: LabelSelector;
  namespaces: string[];
  topologyKey: string;
}

export class PodAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution: WeightedPodAffinityTerm[];
}

export class PreferredSchedulingTerm {
  weight: number;
  preference: NodeSelectorTerm;
}

export class NodeSelectorRequirement {
  key: string;
  operator: string;
  values: string[];
}

export class NodeSelectorTerm {
  matchExpressions: NodeSelectorRequirement[];
}

export class NodeSelector {
  nodeSelectorTerms: NodeSelectorTerm[];
}

export class NodeAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: NodeSelector;
  preferredDuringSchedulingIgnoredDuringExecution: PreferredSchedulingTerm[];
}

export class Affinity {
  nodeAffinity: NodeAffinity;
  podAffinity: PodAffinity;
  podAntiAffinity: PodAntiAffinity;
}


export class PodSecurityContext {
  seLinuxOptions: SELinuxOptions;
  runAsUser: number;
  runAsNonRoot: boolean;
  supplementalGroups: number[];
  fsGroup: number;
}

export class SELinuxOptions {
  user: string;
  role: string;
  type: string;
  level: string;
}

export class Capabilities {
  add: string[];
  drop: string[];
}

export class SecurityContext {
  capabilities: Capabilities;
  privileged: boolean;
  seLinuxOptions: SELinuxOptions;
  runAsUser: number;
  runAsNonRoot: boolean;
  readOnlyRootFilesystem: boolean;
}




export class Handler {
  exec: ExecAction;
  httpGet: HTTPGetAction;
  tcpSocket: TCPSocketAction;
}

export class Lifecycle {
  postStart: Handler;
  preStop: Handler;
}


export class TCPSocketAction {
  port: IntOrString;
  host: string;
}

export class HTTPHeader {
  name: string;
  value: string;
}

export class IntOrString {
}

export class HTTPGetAction {
  path: string;
  port: IntOrString;
  host: string;
  scheme: string;
  httpHeaders: HTTPHeader[];
}

export class ExecAction {
  command: string[];
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
}

export class VolumeMount {
  name: string;
  readOnly: boolean;
  mountPath: string;
  subPath: string;
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

export class SecretKeySelector {
  name: string;
  key: string;
  optional: boolean;
}

export class ConfigMapKeySelector {
  name: string;
  key: string;
  optional: boolean;
}


export class EnvVarSource {
  fieldRef: ObjectFieldSelector;
  resourceFieldRef: ResourceFieldSelector;
  configMapKeyRef: ConfigMapKeySelector;
  secretKeyRef: SecretKeySelector;
}

export class EnvVar {
  name: string;
  value: string;
  valueFrom: EnvVarSource;
}

export class SecretEnvSource {
  name: string;
  optional: boolean;
}

export class ConfigMapEnvSource {
  name: string;
  optional: boolean;
}

export class EnvFromSource {
  prefix: string;
  configMapRef: ConfigMapEnvSource;
  secretRef: SecretEnvSource;
}

export class ContainerPort {
  name: string;
  hostPort: number;
  containerPort: number;
  protocol: string;
  hostIP: string;
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
}

export class StorageOSVolumeSource {
  volumeName: string;
  volumeNamespace: string;
  fsType: string;
  readOnly: boolean;
  secretRef: LocalObjectReference;
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
}

export class PortworxVolumeSource {
  volumeID: string;
  fsType: string;
  readOnly: boolean;
}

export class ConfigMapProjection {
  name: string;
  items: KeyToPath[];
  optional: boolean;
}

export class DownwardAPIProjection {
  items: DownwardAPIVolumeFile[];
}

export class SecretProjection {
  name: string;
  items: KeyToPath[];
  optional: boolean;
}

export class VolumeProjection {
  secret: SecretProjection;
  downwardAPI: DownwardAPIProjection;
  configMap: ConfigMapProjection;
}

export class ProjectedVolumeSource {
  sources: VolumeProjection[];
  defaultMode: number;
}

export class PhotonPersistentDiskVolumeSource {
  pdID: string;
  fsType: string;
}

export class AzureDiskVolumeSource {
  diskName: string;
  diskURI: string;
  cachingMode: string;
  fsType: string;
  readOnly: boolean;
  kind: string;
}

export class QuobyteVolumeSource {
  registry: string;
  volume: string;
  readOnly: boolean;
  user: string;
  group: string;
}

export class VsphereVirtualDiskVolumeSource {
  volumePath: string;
  fsType: string;
  storagePolicyName: string;
  storagePolicyID: string;
}

export class ConfigMapVolumeSource {
  name: string;
  items: KeyToPath[];
  defaultMode: number;
  optional: boolean;
}

export class AzureFileVolumeSource {
  secretName: string;
  shareName: string;
  readOnly: boolean;
}

export class FCVolumeSource {
  targetWWNs: string[];
  lun: number;
  fsType: string;
  readOnly: boolean;
}

export class ResourceFieldSelector {
  containerName: string;
  resource: string;
  divisor: Quantity;
}

export class ObjectFieldSelector {
  apiVersion: string;
  fieldPath: string;
}

export class DownwardAPIVolumeFile {
  path: string;
  fieldRef: ObjectFieldSelector;
  resourceFieldRef: ResourceFieldSelector;
  mode: number;
}

export class DownwardAPIVolumeSource {
  items: DownwardAPIVolumeFile[];
  defaultMode: number;
}

export class FlockerVolumeSource {
  datasetName: string;
  datasetUUID: string;
}

export class CephFSVolumeSource {
  monitors: string[];
  path: string;
  user: string;
  secretFile: string;
  secretRef: LocalObjectReference;
  readOnly: boolean;
}

export class CinderVolumeSource {
  volumeID: string;
  fsType: string;
  readOnly: boolean;
}

export class FlexVolumeSource {
  driver: string;
  fsType: string;
  secretRef: LocalObjectReference;
  readOnly: boolean;
  options: {};
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
}

export class PersistentVolumeClaimVolumeSource {
  claimName: string;
  readOnly: boolean;
}

export class GlusterfsVolumeSource {
  endpoints: string;
  path: string;
  readOnly: boolean;
}

export class LocalObjectReference {
  name: string;
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
}

export class NFSVolumeSource {
  server: string;
  path: string;
  readOnly: boolean;
}

export class KeyToPath {
  key: string;
  path: string;
  mode: number;
}

export class SecretVolumeSource {
  secretName: string;
  items: KeyToPath[];
  defaultMode: number;
  optional: boolean;
}

export class GitRepoVolumeSource {
  repository: string;
  revision: string;
  directory: string;
}

export class AWSElasticBlockStoreVolumeSource {
  volumeID: string;
  fsType: string;
  partition: number;
  readOnly: boolean;
}

export class GCEPersistentDiskVolumeSource {
  pdName: string;
  fsType: string;
  partition: number;
  readOnly: boolean;
}

export class Quantity {




}

export class EmptyDirVolumeSource {
  medium: string;
  sizeLimit: Quantity;
}

export class HostPathVolumeSource {
  path: string;
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
}

export class PodTemplateSpec {
  metadata: ObjectMeta;
  spec: PodSpec;
}

export class LabelSelectorRequirement {
  key: string;
  operator: string;
  values: string[];
}

export class LabelSelector {
  matchLabels: {};
  matchExpressions: LabelSelectorRequirement[];
}

export class JobSpec {
  parallelism: number;
  completions: number;
  activeDeadlineSeconds: string;
  selector: LabelSelector;
  manualSelector: boolean;
  template: PodTemplateSpec;
  backoffLimit?: any;
}

export class JobTemplateSpec {
  metadata: ObjectMeta;
  spec: JobSpec;
}

export class CronJobSpec {
  schedule: string;
  startingDeadlineSeconds: string;
  concurrencyPolicy: string;
  suspend: boolean;
  jobTemplate: JobTemplateSpec;
  successfulJobsHistoryLimit: number;
  failedJobsHistoryLimit: number;
}

export class StatusCause {
  reason: string;
  message: string;
  field: string;
}

export class StatusDetails {
  name: string;
  group: string;
  kind: string;
  uid: string;
  causes: StatusCause[];
  retryAfterSeconds: number;
}

export class ListMeta {
  selfLink: string;
  resourceVersion: string;
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
}

export class Initializer {
  name: string;
}

export class Initializers {
  pending: Initializer[];
  result: Status;
}

export class OwnerReference {
  apiVersion: string;
  kind: string;
  name: string;
  uid: string;
  controller: boolean;
  blockOwnerDeletion: boolean;
}

export class Time {
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
}

export class KubeCronJob {
  kind: string;
  apiVersion: string;
  metadata: ObjectMeta;
  spec: CronJobSpec;
  status: CronJobStatus;
}
