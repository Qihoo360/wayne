/* Do not change, this code is generated from Golang structs */


export class NodeSystemInfo {
  machineID: string;
  systemUUID: string;
  bootID: string;
  kernelVersion: string;
  osImage: string;
  containerRuntimeVersion: string;
  kubeletVersion: string;
  kubeProxyVersion: string;
  operatingSystem: string;
  architecture: string;

  constructor(init?: NodeSystemInfo) {
    if (!init) {  return; }
    if (init.machineID) { this.machineID = init.machineID; }
    if (init.systemUUID) { this.systemUUID = init.systemUUID; }
    if (init.bootID) { this.bootID = init.bootID; }
    if (init.kernelVersion) { this.kernelVersion = init.kernelVersion; }
    if (init.osImage) { this.osImage = init.osImage; }
    if (init.containerRuntimeVersion) { this.containerRuntimeVersion = init.containerRuntimeVersion; }
    if (init.kubeletVersion) { this.kubeletVersion = init.kubeletVersion; }
    if (init.kubeProxyVersion) { this.kubeProxyVersion = init.kubeProxyVersion; }
    if (init.operatingSystem) { this.operatingSystem = init.operatingSystem; }
    if (init.architecture) { this.architecture = init.architecture; }
  }


  static emptyObject(): NodeSystemInfo {
    const result = new NodeSystemInfo();
    return result;
  }

}

export class Quantity {
  Format: string;

  constructor(init?: Quantity) {
    if (!init) {  return; }
    if (init.Format) { this.Format = init.Format; }
  }


  static emptyObject(): Quantity {
    const result = new Quantity();
    return result;
  }

}

export class NodeStatus {
  capacity?: { [key: string]: Quantity };
  nodeInfo: NodeSystemInfo;

  constructor(init?: NodeStatus) {
    if (!init) {  return; }
    if (init.capacity) { this.capacity = init.capacity; }
    if (init.nodeInfo) { this.nodeInfo = init.nodeInfo; }
  }


  static emptyObject(): NodeStatus {
    const result = new NodeStatus();
    result.capacity = null;
    result.nodeInfo = NodeSystemInfo.emptyObject();
    return result;
  }

}

export class Time {
  Time: Date;

  constructor(init?: Time) {
    if (!init) {  return; }
    if (init.Time) {
      this.Time = new Date(init.Time as any);
    }
  }


  static emptyObject(): Time {
    const result = new Time();
    result.Time = null;
    return result;
  }

}

export class Taint {
  key: string;
  value: string;
  effect: string;
  timeAdded?: Time;

  constructor(init?: Taint) {
    if (!init) {  return; }
    if (init.key) { this.key = init.key; }
    if (init.value) { this.value = init.value; }
    if (init.effect) { this.effect = init.effect; }
    if (init.timeAdded) { this.timeAdded = init.timeAdded; }
  }


  static emptyObject(): Taint {
    const result = new Taint();
    result.timeAdded = Time.emptyObject();
    return result;
  }

}

export class LabelMetaData {
  key: string;
  value: string;

  constructor(option?: LabelMetaData) {
    if (option && option instanceof Object) {
      this.key = option.key;
      this.value = option.value;
    }
  }
}

export class TaintMetaData {
  effect: string;
  key: string;
  value: string;
  constructor(option?: LabelMetaData) {
    if (option && option instanceof Object) {
      this.effect = option.key || '';
      this.key = option.key;
      this.value = option.value;
    }
  }
}

export class NodeSpec {
  unschedulable: boolean;
  taints: Taint[];
  ready: string;

  constructor(init?: NodeSpec) {
    if (!init) {  return; }
    if (init.unschedulable) { this.unschedulable = init.unschedulable; }
    if (init.taints) { this.taints = init.taints; }
    if (init.ready) { this.ready = init.ready; }
  }


  static emptyObject(): NodeSpec {
    const result = new NodeSpec();
    result.taints = [];
    return result;
  }

}

export class Node {
  name: string;
  labels?: { [key: string]: string };
  spec: NodeSpec;
  status: NodeStatus;

  constructor(init?: Node) {
    if (!init) {  return; }
    if (init.name) { this.name = init.name; }
    if (init.labels) { this.labels = init.labels; }
    if (init.spec) { this.spec = init.spec; }
    if (init.status) { this.status = init.status; }
  }


  static emptyObject(): Node {
    const result = new Node();
    result.labels = null;
    result.spec = NodeSpec.emptyObject();
    result.status = NodeStatus.emptyObject();
    return result;
  }

}
