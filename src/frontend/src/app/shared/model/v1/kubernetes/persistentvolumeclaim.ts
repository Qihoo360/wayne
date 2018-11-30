/* Do not change, this code is generated from Golang structs */


export class PersistentVolumeClaimStatus {
  phase: string;
  accessModes: string[];
  capacity: {};
  //[PersistentVolumeClaimStatus:]


  //[end]
}

export class ResourceRequirements {
  limits: {};
  requests: {};
  //[ResourceRequirements:]


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

export class PersistentVolumeClaimSpec {
  accessModes: string[];
  selector: LabelSelector;
  resources: ResourceRequirements;
  volumeName: string;
  storageClassName: string;
  //[PersistentVolumeClaimSpec:]


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

export class KubePersistentVolumeClaim {
  kind: string;
  apiVersion: string;
  metadata: ObjectMeta;
  spec: PersistentVolumeClaimSpec;
  status: PersistentVolumeClaimStatus;
  //[PersistentVolumeClaim:]


  //[end]
}
