/* Do not change, this code is generated from Golang structs */


import { TemplateStatus } from './status';

export class Namespace {
  id: number;
  name: string;
  metaData: string;
  createTime?: Date;
  updateTime?: Date;
  user: string;
  deleted: boolean;

  constructor(init?: Namespace) {
    if (!init) { return; }
    if (init.id) { this.id = init.id; }
    if (init.name) { this.name = init.name; }
    if (init.metaData) { this.metaData = init.metaData; }
    if (init.createTime) { this.createTime = new Date(init.createTime as any); }
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
    if (!init) { return; }
    if (init.id) { this.id = init.id; }
    if (init.name) { this.name = init.name; }
    if (init.email) { this.email = init.email; }
    if (init.display) { this.display = init.display; }
    if (init.comment)  { this.comment = init.comment; }
    if (init.type)  { this.type = init.type; }
    if (init.enabled)  { this.enabled = init.enabled; }
    if (init.admin)  { this.admin = init.admin; }
    if (init.lastLogin)  { this.lastLogin = new Date(init.lastLogin as any); }
    if (init.lastIp)  { this.lastIp = init.lastIp; }
    if (init.createTime)  { this.createTime = new Date(init.createTime as any); }
    if (init.updateTime)  { this.updateTime = new Date(init.updateTime as any); }
    if (init.namespaces)  { this.namespaces = init.namespaces; }
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
    if (!init) { return; }
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
    if (!init) { return; }
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
  user: string;
  deleted: boolean;
  appId: number;

  constructor(init?: Statefulset) {
    if (!init) { return; }
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

export class StatefulsetTemplate {
  id: number;
  name: string;
  template: string;
  statefulset?: Statefulset;
  description: string;
  createTime: Date;
  updateTime: Date;
  user: string;
  deleted: boolean;
  statefulsetId: number;

  status: TemplateStatus[];
  containerVersions: string[];

  constructor(init?: StatefulsetTemplate) {
    if (!init) { return; }
    if (init.id) { this.id = init.id; }
    if (init.name) { this.name = init.name; }
    if (init.template) { this.template = init.template; }
    if (init.statefulset) { this.statefulset = init.statefulset; }
    if (init.description) { this.description = init.description; }
    if (init.createTime) { this.createTime = new Date(init.createTime as any); }
    if (init.updateTime) { this.updateTime = new Date(init.updateTime as any); }
    if (init.user) { this.user = init.user; }
    if (init.deleted) { this.deleted = init.deleted; }
    if (init.statefulsetId) { this.statefulsetId = init.statefulsetId; }
    if (init.status) { this.status = init.status; }
  }


  static emptyObject(): StatefulsetTemplate {
    const result = new StatefulsetTemplate();
    result.id = 0;
    result.name = '';
    result.template = '';
    result.statefulset = Statefulset.emptyObject();
    result.description = '';
    result.createTime = null;
    result.updateTime = null;
    result.user = '';
    result.deleted = false;
    result.statefulsetId = 0;
    result.status = [];
    return result;
  }

}
