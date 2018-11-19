export class Permission {
  id: number;
  name: string;
  comment: string;
  type: string;
}

export class TypePermission {
  app: ActionPermission = new ActionPermission();
  appUser: ActionPermission = new ActionPermission();
  namespace: ActionPermission = new ActionPermission();
  namespaceUser: ActionPermission = new ActionPermission();
  deployment: ActionPermission = new ActionPermission();
  secret: ActionPermission = new ActionPermission();
  service: ActionPermission = new ActionPermission();
  pvc: ActionPermission = new ActionPermission();
  configmap: ActionPermission = new ActionPermission();
  cronjob: ActionPermission = new ActionPermission();
  webHook: ActionPermission = new ActionPermission();
  statefulset: ActionPermission = new ActionPermission();
  apiKey: ActionPermission = new ActionPermission();
  daemonSet: ActionPermission = new ActionPermission();

  deserialize(input) {
    this.app = input.app ? input.app : this.app;
    this.appUser = input.appUser ? input.appUser : this.appUser;
    this.namespace = input.namespace ? input.namespace : this.namespace;
    this.namespaceUser = input.namespaceUser ? input.namespaceUser : this.namespaceUser;
    this.deployment = input.deployment ? input.deployment : this.deployment;
    this.secret = input.secret ? input.secret : this.secret;
    this.service = input.service ? input.service : this.service;
    this.pvc = input.pvc ? input.pvc : this.pvc;
    this.configmap = input.configmap ? input.configmap : this.configmap;
    this.cronjob = input.cronjob ? input.cronjob : this.cronjob;
    this.webHook = input.webHook ? input.webHook : this.webHook;
    this.statefulset = input.statefulset ? input.statefulset : this.statefulset;
    this.apiKey = input.apiKey ? input.apiKey : this.apiKey;
    this.daemonSet = input.daemonSet ? input.daemonSet : this.daemonSet;
  }
}

export class ActionPermission {
  read = false;
  create = false;
  update = false;
  delete = false;
  deploy = false;
  offline = false;
}
