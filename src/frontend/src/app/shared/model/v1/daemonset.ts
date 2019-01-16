/* Do not change, this code is generated from Golang structs */
import { App } from './app';

export class PodAntiAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution: WeightedPodAffinityTerm[];

  constructor(init?: PodAntiAffinity) {
    if (!init) {  return; }
    if (init.requiredDuringSchedulingIgnoredDuringExecution) {
      this.requiredDuringSchedulingIgnoredDuringExecution = init.requiredDuringSchedulingIgnoredDuringExecution;
    }
    if (init.preferredDuringSchedulingIgnoredDuringExecution) {
      this.preferredDuringSchedulingIgnoredDuringExecution = init.preferredDuringSchedulingIgnoredDuringExecution;
    }
  }


  static emptyObject(): PodAntiAffinity {
    const result = new PodAntiAffinity();
    result.requiredDuringSchedulingIgnoredDuringExecution = [];
    result.preferredDuringSchedulingIgnoredDuringExecution = [];
    return result;
  }

}

export class LabelSelectorRequirement {
  key: string;
  operator: string;
  values: string[];

  constructor(init?: LabelSelectorRequirement) {
    if (!init) {  return; }
    if (init.key) { this.key = init.key; }
    if (init.operator) { this.operator = init.operator; }
    if (init.values) { this.values = init.values; }
  }


  static emptyObject(): LabelSelectorRequirement {
    const result = new LabelSelectorRequirement();
    result.values = [];
    return result;
  }

}

export class LabelSelector {
  matchLabels?: { [key: string]: string };
  matchExpressions: LabelSelectorRequirement[];

  constructor(init?: LabelSelector) {
    if (!init) {  return; }
    if (init.matchLabels) { this.matchLabels = init.matchLabels; }
    if (init.matchExpressions) { this.matchExpressions = init.matchExpressions; }
  }


  static emptyObject(): LabelSelector {
    const result = new LabelSelector();
    result.matchLabels = null;
    result.matchExpressions = [];
    return result;
  }

}

export class PodAffinityTerm {
  labelSelector?: LabelSelector;
  namespaces: string[];
  topologyKey: string;

  constructor(init?: PodAffinityTerm) {
    if (!init) {  return; }
    if (init.labelSelector) { this.labelSelector = init.labelSelector; }
    if (init.namespaces) { this.namespaces = init.namespaces; }
    if (init.topologyKey) { this.topologyKey = init.topologyKey; }
  }


  static emptyObject(): PodAffinityTerm {
    const result = new PodAffinityTerm();
    result.labelSelector = LabelSelector.emptyObject();
    result.namespaces = [];
    return result;
  }

}

export class WeightedPodAffinityTerm {
  weight: number;
  podAffinityTerm: PodAffinityTerm;

  constructor(init?: WeightedPodAffinityTerm) {
    if (!init) {  return; }
    if (init.weight) { this.weight = init.weight; }
    if (init.podAffinityTerm) { this.podAffinityTerm = init.podAffinityTerm; }
  }


  static emptyObject(): WeightedPodAffinityTerm {
    const result = new WeightedPodAffinityTerm();
    result.podAffinityTerm = PodAffinityTerm.emptyObject();
    return result;
  }

}

export class PodAffinity {
  requiredDuringSchedulingIgnoredDuringExecution: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution: WeightedPodAffinityTerm[];

  constructor(init?: PodAffinity) {
    if (!init) {  return; }
    if (init.requiredDuringSchedulingIgnoredDuringExecution) {
      this.requiredDuringSchedulingIgnoredDuringExecution = init.requiredDuringSchedulingIgnoredDuringExecution;
    }
    if (init.preferredDuringSchedulingIgnoredDuringExecution) {
      this.preferredDuringSchedulingIgnoredDuringExecution = init.preferredDuringSchedulingIgnoredDuringExecution;
    }
  }


  static emptyObject(): PodAffinity {
    const result = new PodAffinity();
    result.requiredDuringSchedulingIgnoredDuringExecution = [];
    result.preferredDuringSchedulingIgnoredDuringExecution = [];
    return result;
  }

}

export class NodeSelectorRequirement {
  key: string;
  operator: string;
  values: string[];

  constructor(init?: NodeSelectorRequirement) {
    if (!init) {  return; }
    if (init.key) { this.key = init.key; }
    if (init.operator) { this.operator = init.operator; }
    if (init.values) { this.values = init.values; }
  }


  static emptyObject(): NodeSelectorRequirement {
    const result = new NodeSelectorRequirement();
    result.values = [];
    return result;
  }

}

export class NodeSelectorTerm {
  matchExpressions: NodeSelectorRequirement[];

  constructor(init?: NodeSelectorTerm) {
    if (!init) {  return; }
    if (init.matchExpressions) { this.matchExpressions = init.matchExpressions; }
  }


  static emptyObject(): NodeSelectorTerm {
    const result = new NodeSelectorTerm();
    result.matchExpressions = [];
    return result;
  }

}

export class PreferredSchedulingTerm {
  weight: number;
  preference: NodeSelectorTerm;

  constructor(init?: PreferredSchedulingTerm) {
    if (!init) {  return; }
    if (init.weight) { this.weight = init.weight; }
    if (init.preference) { this.preference = init.preference; }
  }


  static emptyObject(): PreferredSchedulingTerm {
    const result = new PreferredSchedulingTerm();
    result.preference = NodeSelectorTerm.emptyObject();
    return result;
  }

}

export class NodeSelector {
  nodeSelectorTerms: NodeSelectorTerm[];

  constructor(init?: NodeSelector) {
    if (!init) {  return; }
    if (init.nodeSelectorTerms) { this.nodeSelectorTerms = init.nodeSelectorTerms; }
  }


  static emptyObject(): NodeSelector {
    const result = new NodeSelector();
    result.nodeSelectorTerms = [];
    return result;
  }

}

export class NodeAffinity {
  requiredDuringSchedulingIgnoredDuringExecution?: NodeSelector;
  preferredDuringSchedulingIgnoredDuringExecution: PreferredSchedulingTerm[];

  constructor(init?: NodeAffinity) {
    if (!init) {  return; }
    if (init.requiredDuringSchedulingIgnoredDuringExecution) {
      this.requiredDuringSchedulingIgnoredDuringExecution = init.requiredDuringSchedulingIgnoredDuringExecution;
    }
    if (init.preferredDuringSchedulingIgnoredDuringExecution) {
      this.preferredDuringSchedulingIgnoredDuringExecution = init.preferredDuringSchedulingIgnoredDuringExecution;
    }
  }


  static emptyObject(): NodeAffinity {
    const result = new NodeAffinity();
    result.requiredDuringSchedulingIgnoredDuringExecution = NodeSelector.emptyObject();
    result.preferredDuringSchedulingIgnoredDuringExecution = [];
    return result;
  }

}

export class Affinity {
  nodeAffinity?: NodeAffinity;
  podAffinity?: PodAffinity;
  podAntiAffinity?: PodAntiAffinity;

  constructor(init?: Affinity) {
    if (!init) {  return; }
    if (init.nodeAffinity) { this.nodeAffinity = init.nodeAffinity; }
    if (init.podAffinity) { this.podAffinity = init.podAffinity; }
    if (init.podAntiAffinity) { this.podAntiAffinity = init.podAntiAffinity; }
  }


  static emptyObject(): Affinity {
    const result = new Affinity();
    result.nodeAffinity = NodeAffinity.emptyObject();
    result.podAffinity = PodAffinity.emptyObject();
    result.podAntiAffinity = PodAntiAffinity.emptyObject();
    return result;
  }

}

export class DaemonSetMetaData {
  resources?: { [key: string]: string };
  affinity?: Affinity;
  privileged?: { [key: string]: boolean };

  constructor(init?: DaemonSetMetaData) {
    if (!init) {  return; }
    if (init.resources) { this.resources = init.resources; }
    if (init.affinity) { this.affinity = init.affinity; }
    if (init.privileged) { this.privileged = init.privileged; }
  }


  static emptyObject(): DaemonSetMetaData {
    const result = new DaemonSetMetaData();
    result.resources = null;
    result.affinity = Affinity.emptyObject();
    result.privileged = null;
    return result;
  }

}

export class DaemonSet {
  id: number;
  name: string;
  metaData: string;
  app?: App;
  description: string;
  metaDataObj: DaemonSetMetaData;
  createTime: Date;
  updateTime: Date;
  user: string;
  deleted: boolean;
  appId: number;
  order: number;

  constructor(init?: DaemonSet) {
    if (!init) {  return; }
    if (init.id) { this.id = init.id; }
    if (init.name) { this.name = init.name; }
    if (init.metaData) { this.metaData = init.metaData; }
    if (init.app) { this.app = init.app; }
    if (init.description) { this.description = init.description; }
    if (init.createTime) {
      this.createTime = new Date(init.createTime as any);
    }
    if (init.updateTime) {
      this.updateTime = new Date(init.updateTime as any);
    }
    if (init.user) { this.user = init.user; }
    if (init.deleted) { this.deleted = init.deleted; }
    if (init.appId) { this.appId = init.appId; }
  }


  static emptyObject(): DaemonSet {
    const result = new DaemonSet();
    result.app = App.emptyObject();
    result.createTime = null;
    result.updateTime = null;
    return result;
  }

}
