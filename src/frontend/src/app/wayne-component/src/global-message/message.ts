import { AlertType } from '../shared.const';

export class Message {
  statusCode: number;
  message: string;
  alertType: AlertType;

  [propName: string]: any;

  public get title(): string {
    switch (this.alertType) {
      case AlertType.DANGER:
        return '错误';
      case AlertType.INFO:
        return '提示';
      case AlertType.SUCCESS:
        return '成功';
      case AlertType.WARNING:
        return '警告';
      default:
        return '';
    }
  }

  constructor() {
  }

  static newMessage(statusCode: number, message: string, alertType: AlertType): Message {
    const m = new Message();
    m.statusCode = statusCode;
    m.message = message;
    m.alertType = alertType;
    return m;
  }


  toString(): string {
    return 'Message with statusCode:' + this.statusCode +
      ', message:' + this.message +
      ', alert type:' + this.title;
  }
}
