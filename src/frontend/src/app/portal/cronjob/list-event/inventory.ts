import {Event} from '../../../shared/model/v1/deploymenttpl';
import {Comparator} from '@clr/angular';

export class Inventory {
  public size = 10;
  private _all: Event[];

  get all(): Event[] {
    return this._all.slice();
  }

  reset(events: Event[]) {
    this._all = events;
  }
}

export class TimeComparator implements Comparator<Event> {
  compare(a: Event, b: Event) {
    return new Date(a.firstSeen).getTime() - new Date(b.firstSeen).getTime();
  }
}
