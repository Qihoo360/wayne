import { App } from './app';
import { User } from './user';
import { Group } from './group';

export class AppUser {
  id: number;
  app: App;
  user: User;
  groups: Group[];
  group: Group;
  groupsName: string;
  createTime: Date;
}
