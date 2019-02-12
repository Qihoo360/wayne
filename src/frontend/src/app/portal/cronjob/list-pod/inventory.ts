import { ClrDatagridComparatorInterface } from '@clr/angular';
import { Pod } from '../../../shared/model/v1/kubernetes/pod';

export class Inventory {
  public size = 10;
  private _all: Pod[];

  get all(): Pod[] {
    return this._all.slice();
  }

  reset(events: Pod[]) {
    this._all = events;
  }
}

export class TimeComparator implements ClrDatagridComparatorInterface<Pod> {
  compare(a: Pod, b: Pod) {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  }
}

export class StateComparator implements ClrDatagridComparatorInterface<Pod> {
  compare(a: Pod, b: Pod) {
    return a.state.localeCompare(b.state);
  }
}
