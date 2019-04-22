/* Do not change, this code is generated from Golang structs */


import { TemplateState } from '../../shared.const';
import { KubePersistentVolumeClaim } from './kubernetes/persistentvolumeclaim';
import { PersistentVolumeClaimFileSystemStatus, PersistentVolumeClaimSnap } from './persistentvolumeclaim';

export class PublishStatus {
  id: number;
  type: number;
  resourceId: number;
  templateId: number;
  cluster: string;
  state: TemplateState;
  pvc: KubePersistentVolumeClaim;
  fileSystemStatus: PersistentVolumeClaimFileSystemStatus;
  rbdImage: string;
  snaps: PersistentVolumeClaimSnap[];
  errNum: number;
}
