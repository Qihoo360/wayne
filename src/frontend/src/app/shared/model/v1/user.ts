import { Namespace } from './namespace';

export class User {
  id: number;
  name: string;
  email: string;
  display: string;
  comment: string;
  type: number;
  deleted: boolean;
  admin: boolean;
  lastLogin: string;
  lastIp: string;
  password: string;
  rePassword: string;
  namespaces: Namespace[];
}
