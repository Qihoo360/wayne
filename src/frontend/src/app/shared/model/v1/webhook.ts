export class WebHook {
  id: number;
  name: string;
  user: string;
  scope: number;
  objectId: number;
  secret: string;
  url: string;
  events: string;
  enabled: boolean;
  createTime: Date;
}
