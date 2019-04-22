export class AuditLog {
  id: number;
  subjectId: number;
  logType: string;
  logLevel: string;
  action: string;
  message: string;
  userIp: string;
  user: string;
  createTime: Date;
}
