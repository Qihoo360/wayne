/* Do not change, this code is generated from Golang structs */

import { Group } from './group';

export class ApiKey {
  constructor() {
    this.group = new Group();
  }

  id: number;
  name: string;
  token: string;
  type: number;
  group: Group;
  resourceId: number;
  description: string;
  user: string;
  expireIn: number;
  deleted: boolean;
  createTime: Date;
  updateTime: Date;
}
