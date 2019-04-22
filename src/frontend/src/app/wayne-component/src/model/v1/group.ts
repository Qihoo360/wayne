import { Permission } from './permission';

export class Group {
  id: number;
  name: string;
  type: number;
  comment: string;
  permissions: Permission[];
}
