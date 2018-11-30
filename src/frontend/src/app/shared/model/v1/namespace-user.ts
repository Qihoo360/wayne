import { Namespace } from './namespace';
import { User } from './user';
import { Group } from './group';

export class NamespaceUser {
  id: number;
  namespace: Namespace;
  user: User;
  groups: Group[];
  group: Group;
  groupsName: string;
  createTime: Date;
}
