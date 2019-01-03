import { Comparator, StringFilter } from '@clr/angular';
import { PersistentVolume } from '../../../../shared/model/v1/kubernetes/persistentvolume';

export class Inventory {
  public size = 10;
  private _all: PersistentVolume[];

  get all(): PersistentVolume[] {
    return this._all.slice();
  }

  reset(events: PersistentVolume[]) {
    this._all = events;
  }
}

export class TimeComparator implements Comparator<PersistentVolume> {
  compare(a: PersistentVolume, b: PersistentVolume) {
    return new Date(a.metadata.creationTimestamp).getTime() - new Date(b.metadata.creationTimestamp).getTime();
  }
}

export class NameComparator implements Comparator<PersistentVolume> {
  compare(a: PersistentVolume, b: PersistentVolume) {
    return a.metadata.name.localeCompare(b.metadata.name);
  }
}

export class NameFilter implements StringFilter<PersistentVolume> {
  accepts(pv: PersistentVolume, search: string): boolean {
    return pv.metadata.name.indexOf(search) >= 0;
  }
}

export class RbdImageNameFilter implements StringFilter<PersistentVolume> {
  accepts(pv: PersistentVolume, search: string): boolean {
    let rbdImage = '';
    if (pv.spec.rbd) {
      rbdImage = pv.spec.rbd.image;
    }
    return rbdImage.indexOf(search) >= 0;
  }
}

export class PvcFilter implements StringFilter<PersistentVolume> {
  accepts(pv: PersistentVolume, search: string): boolean {
    if (pv.spec.claimRef) {
      return pv.spec.claimRef.name.indexOf(search) >= 0;
    } else {
      return false;
    }
  }
}
