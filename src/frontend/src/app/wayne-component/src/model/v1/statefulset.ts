/* Do not change, this code is generated from Golang structs */

export class LabelSelectorRequirement {
  key: string;
  operator: string;
  values: string[];

  constructor(init?: LabelSelectorRequirement) {
    if (!init) {  return; }
    if (init.key) {
      this.key = init.key;
    }
    if (init.operator) {
      this.operator = init.operator;
    }
    if (init.values) {
      this.values = init.values;
    }
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
    if (init.matchLabels) {
      this.matchLabels = init.matchLabels;
    }
    if (init.matchExpressions) {
      this.matchExpressions = init.matchExpressions;
    }
  }


  static emptyObject(): LabelSelector {
    const result = new LabelSelector();
    result.matchLabels = null;
    result.matchExpressions = [];
    return result;
  }

}
export class Namespace {
  id: number;
  name: string;
  metaData: string;
  createTime?: Date;
  updateTime?: Date;
  user: string;
  deleted: boolean;

  constructor(init?: Namespace) {
    if (!init) {  return; }
    if (init.id) { this.id = init.id; }
    if (init.name) { this.name = init.name; }
    if (init.metaData) {  this.metaData = init.metaData; }
    if (init.createTime)  { this.createTime = new Date(init.createTime as any); }
    if (init.updateTime) { this.updateTime = new Date(init.updateTime as any); }
    if (init.user) { this.user = init.user; }
    if (init.deleted) { this.deleted = init.deleted; }
  }


  static emptyObject(): Namespace {
    const result = new Namespace();
    result.id = 0;
    result.name = '';
    result.metaData = '';
    result.createTime = null;
    result.updateTime = null;
    result.user = '';
    result.deleted = false;
    return result;
  }

}

export class User {
  id: number;
  name: string;
  email: string;
  display: string;
  comment: string;
  type: number;
  enabled: boolean;
  admin: boolean;
  lastLogin?: Date;
  lastIp: string;
  createTime?: Date;
  updateTime?: Date;
  namespaces: Namespace[];

  constructor(init?: User) {
    if (!init) {  return; }
    if (init.id) { this.id = init.id; }
    if (init.name) { this.name = init.name; }
    if (init.email) { this.email = init.email; }
    if (init.display) { this.display = init.display; }
    if (init.comment) { this.comment = init.comment; }
    if (init.type) { this.type = init.type; }
    if (init.enabled) { this.enabled = init.enabled; }
    if (init.admin) { this.admin = init.admin; }
    if (init.lastLogin) { this.lastLogin = new Date(init.lastLogin as any); }
    if (init.lastIp) { this.lastIp = init.lastIp; }
    if (init.createTime)  { this.createTime = new Date(init.createTime as any); }
    if (init.updateTime) { this.updateTime = new Date(init.updateTime as any); }
    if (init.namespaces) { this.namespaces = init.namespaces; }
  }


  static emptyObject(): User {
    const result = new User();
    result.id = 0;
    result.name = '';
    result.email = '';
    result.display = '';
    result.comment = '';
    result.type = 0;
    result.enabled = false;
    result.admin = false;
    result.lastLogin = null;
    result.lastIp = '';
    result.createTime = null;
    result.updateTime = null;
    result.namespaces = [];
    return result;
  }

}

export class App {
  id: number;
  name: string;
  namespace?: Namespace;
  metaData: string;
  description: string;
  createTime?: Date;
  updateTime?: Date;
  user: string;
  deleted: boolean;
  AppStars: AppStarred[];

  constructor(init?: App) {
    if (!init) {  return; }
    if (init.id) { this.id = init.id; }
    if (init.name) { this.name = init.name; }
    if (init.namespace) { this.namespace = init.namespace; }
    if (init.metaData) { this.metaData = init.metaData; }
    if (init.description) { this.description = init.description; }
    if (init.createTime) { this.createTime = new Date(init.createTime as any); }
    if (init.updateTime) { this.updateTime = new Date(init.updateTime as any); }
    if (init.user) { this.user = init.user; }
    if (init.deleted) { this.deleted = init.deleted; }
    if (init.AppStars) { this.AppStars = init.AppStars; }
  }


  static emptyObject(): App {
    const result = new App();
    result.id = 0;
    result.name = '';
    result.namespace = Namespace.emptyObject();
    result.metaData = '';
    result.description = '';
    result.createTime = null;
    result.updateTime = null;
    result.user = '';
    result.deleted = false;
    result.AppStars = [];
    return result;
  }

}

export class AppStarred {
  id: number;
  app?: App;
  user?: User;

  constructor(init?: AppStarred) {
    if (!init) {  return; }
    if (init.id) { this.id = init.id; }
    if (init.app) { this.app = init.app; }
    if (init.user) { this.user = init.user; }
  }


  static emptyObject(): AppStarred {
    const result = new AppStarred();
    result.id = 0;
    result.app = App.emptyObject();
    result.user = User.emptyObject();
    return result;
  }

}

export class Statefulset {
  id: number;
  name: string;
  metaData: string;
  app?: App;
  description: string;
  createTime: Date;
  updateTime: Date;
  metaDataObj: StatefulsetMetaData;
  user: string;
  order: number;
  deleted: boolean;
  appId: number;

  constructor(init?: Statefulset) {
    if (!init) {  return; }
    if (init.id) { this.id = init.id; }
    if (init.name) { this.name = init.name; }
    if (init.metaData) { this.metaData = init.metaData; }
    if (init.app) { this.app = init.app; }
    if (init.description) { this.description = init.description; }
    if (init.createTime) { this.createTime = new Date(init.createTime as any); }
    if (init.updateTime) { this.updateTime = new Date(init.updateTime as any); }
    if (init.user) { this.user = init.user; }
    if (init.deleted) { this.deleted = init.deleted; }
    if (init.appId) { this.appId = init.appId; }
  }


  static emptyObject(): Statefulset {
    const result = new Statefulset();
    result.id = 0;
    result.name = '';
    result.metaData = '';
    result.app = App.emptyObject();
    result.description = '';
    result.createTime = null;
    result.updateTime = null;
    result.user = '';
    result.deleted = false;
    result.appId = 0;
    return result;
  }

}

export class PodAffinityTerm {
  labelSelector?: LabelSelector;
  namespaces: string[];
  topologyKey: string;

  constructor(init?: PodAffinityTerm) {
    if (!init) {  return; }
    if (init.labelSelector) {
      this.labelSelector = init.labelSelector;
    }
    if (init.namespaces) {
      this.namespaces = init.namespaces;
    }
    if (init.topologyKey) {
      this.topologyKey = init.topologyKey;
    }
  }


  static emptyObject(): PodAffinityTerm {
    const result = new PodAffinityTerm();
    result.labelSelector = LabelSelector.emptyObject();
    result.namespaces = [];
    return result;
  }

}

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

export class WeightedPodAffinityTerm {
  weight: number;
  podAffinityTerm: PodAffinityTerm;

  constructor(init?: WeightedPodAffinityTerm) {
    if (!init) {  return; }
    if (init.weight) {
      this.weight = init.weight;
    }
    if (init.podAffinityTerm) {
      this.podAffinityTerm = init.podAffinityTerm;
    }
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

export class NodeSelectorTerm {
  matchExpressions: NodeSelectorRequirement[];

  constructor(init?: NodeSelectorTerm) {
    if (!init) {  return; }
    if (init.matchExpressions) {
      this.matchExpressions = init.matchExpressions;
    }
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
    if (init.weight) {
      this.weight = init.weight;
    }
    if (init.preference) {
      this.preference = init.preference;
    }
  }


  static emptyObject(): PreferredSchedulingTerm {
    const result = new PreferredSchedulingTerm();
    result.preference = NodeSelectorTerm.emptyObject();
    return result;
  }

}

export class NodeSelectorRequirement {
  key: string;
  operator: string;
  values: string[];

  constructor(init?: NodeSelectorRequirement) {
    if (!init) {  return; }
    if (init.key) {
      this.key = init.key;
    }
    if (init.operator) {
      this.operator = init.operator;
    }
    if (init.values) {
      this.values = init.values;
    }
  }


  static emptyObject(): NodeSelectorRequirement {
    const result = new NodeSelectorRequirement();
    result.values = [];
    return result;
  }

}

export class NodeSelector {
  nodeSelectorTerms: NodeSelectorTerm[];

  constructor(init?: NodeSelector) {
    if (!init) {  return; }
    if (init.nodeSelectorTerms) {
      this.nodeSelectorTerms = init.nodeSelectorTerms;
    }
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

export class StatefulsetMetaData {
  replicas?: { [key: string]: number };
  resources?: { [key: string]: string };
  affinity?: Affinity;
  privileged?: { [key: string]: boolean };

  constructor(init?: StatefulsetMetaData) {
    if (!init) {  return; }
    if (init.replicas) { this.replicas = init.replicas; }
    if (init.resources) { this.resources = init.resources; }
    if (init.affinity) { this.affinity = init.affinity; }
    if (init.privileged) { this.privileged = init.privileged; }
  }


  static emptyObject(): StatefulsetMetaData {
    const result = new StatefulsetMetaData();
    result.replicas = null;
    result.resources = null;
    result.affinity = Affinity.emptyObject();
    result.privileged = null;
    return result;
  }

}
