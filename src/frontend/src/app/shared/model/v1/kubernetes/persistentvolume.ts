/* Do not change, this code is generated from Golang structs */


export class PersistentVolumeStatus {
  phase: string;
  message: string;
  reason: string;
  //[PersistentVolumeStatus:]


  //[end]
}

export class ObjectReference {
  kind: string;
  namespace: string;
  name: string;
  uid: string;
  apiVersion: string;
  resourceVersion: string;
  fieldPath: string;
  //[ObjectReference:]


  //[end]
}

export class StorageOSPersistentVolumeSource {
  volumeName: string;
  volumeNamespace: string;
  fsType: string;
  readOnly: boolean;
  secretRef: ObjectReference;
  //[StorageOSPersistentVolumeSource:]


  //[end]
}

export class LocalVolumeSource {
  path: string;
  //[LocalVolumeSource:]


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

export class AzureFileVolumeSource {
  secretName: string;
  shareName: string;
  readOnly: boolean;
  //[AzureFileVolumeSource:]


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

export class FlockerVolumeSource {
  datasetName: string;
  datasetUUID: string;
  //[FlockerVolumeSource:]


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

export class CephFSVolumeSource {
  monitors: string[];
  path: string;
  user: string;
  secretFile: string;
  secretRef: LocalObjectReference;
  readOnly: boolean;
  //[CephFSVolumeSource:]


  //[end]
  // 标识是否已经创建cephfs路径
  created: boolean;
}

export class CinderVolumeSource {
  volumeID: string;
  fsType: string;
  readOnly: boolean;
  //[CinderVolumeSource:]


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

export class LocalObjectReference {
  name: string;
  //[LocalObjectReference:]


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
  // 标识是否已经创建Rbd镜像
  created: boolean;
}

export class NFSVolumeSource {
  server: string;
  path: string;
  readOnly: boolean;
  //[NFSVolumeSource:]


  //[end]
}

export class GlusterfsVolumeSource {
  endpoints: string;
  path: string;
  readOnly: boolean;
  //[GlusterfsVolumeSource:]


  //[end]
}

export class HostPathVolumeSource {
  path: string;
  //[HostPathVolumeSource:]


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

export class PersistentVolumeSpec {
  capacity: {};
  gcePersistentDisk: GCEPersistentDiskVolumeSource;
  awsElasticBlockStore: AWSElasticBlockStoreVolumeSource;
  hostPath: HostPathVolumeSource;
  glusterfs: GlusterfsVolumeSource;
  nfs: NFSVolumeSource;
  rbd: RBDVolumeSource;
  iscsi: ISCSIVolumeSource;
  cinder: CinderVolumeSource;
  cephfs: CephFSVolumeSource;
  fc: FCVolumeSource;
  flocker: FlockerVolumeSource;
  flexVolume: FlexVolumeSource;
  azureFile: AzureFileVolumeSource;
  vsphereVolume: VsphereVirtualDiskVolumeSource;
  quobyte: QuobyteVolumeSource;
  azureDisk: AzureDiskVolumeSource;
  photonPersistentDisk: PhotonPersistentDiskVolumeSource;
  portworxVolume: PortworxVolumeSource;
  scaleIO: ScaleIOVolumeSource;
  local: LocalVolumeSource;
  storageos: StorageOSPersistentVolumeSource;
  accessModes: string[];
  claimRef: ObjectReference;
  persistentVolumeReclaimPolicy: string;
  storageClassName: string;
  //[PersistentVolumeSpec:]


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

export class PersistentVolume {
  kind: string;
  apiVersion: string;
  metadata: ObjectMeta;
  spec: PersistentVolumeSpec;
  status: PersistentVolumeStatus;
  //[PersistentVolume:]


  //[end]
}
