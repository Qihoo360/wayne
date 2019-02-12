import { ClrDatagridComparatorInterface, ClrDatagridStringFilterInterface } from '@clr/angular';
import { Node } from '../../../../shared/model/v1/kubernetes/node-list';

export class Inventory {
  public size = 10;
  private _all: Node[];

  get all(): Node[] {
    return this._all.slice();
  }

  reset(events: Node[]) {
    this._all = events;
  }
}

export class SchedulerComparator implements ClrDatagridComparatorInterface<Node> {
  compare(a: Node, b: Node) {
    return a.spec.unschedulable.toString().localeCompare(b.spec.unschedulable.toString());
  }
}

export class ReadyComparator implements ClrDatagridComparatorInterface<Node> {
  compare(a: Node, b: Node) {
    return a.spec.ready.localeCompare(b.spec.ready);
  }
}

export class OsImageComparator implements ClrDatagridComparatorInterface<Node> {
  compare(a: Node, b: Node) {
    return a.status.nodeInfo.osImage.localeCompare(b.status.nodeInfo.osImage);
  }
}

export class KernelComparator implements ClrDatagridComparatorInterface<Node> {
  compare(a: Node, b: Node) {
    return a.status.nodeInfo.kernelVersion.localeCompare(b.status.nodeInfo.kernelVersion);
  }
}

export class CriComparator implements ClrDatagridComparatorInterface<Node> {
  compare(a: Node, b: Node) {
    return a.status.nodeInfo.containerRuntimeVersion.localeCompare(b.status.nodeInfo.containerRuntimeVersion);
  }
}

export class NameComparator implements ClrDatagridComparatorInterface<Node> {
  compare(a: Node, b: Node) {
    return a.name.localeCompare(b.name);
  }
}

export class NameFilter implements ClrDatagridStringFilterInterface<Node> {
  accepts(node: Node, search: string): boolean {
    return node.name.indexOf(search) >= 0;
  }
}

export class LabelFilter implements ClrDatagridStringFilterInterface<Node> {
  accepts(node: Node, search: string): boolean {
    const keys = Object.keys(node.labels);
    for (const key of keys) {
      const value = node.labels[key];
      if ((key + ':' + value).indexOf(search) >= 0) {
        return true;
      }
    }
    return false;
  }
}
