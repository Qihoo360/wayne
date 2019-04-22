import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Message } from './message';
import { AlertType } from '../shared.const';

@Injectable()
export class MessageService {

  messageAnnouncedSource = new Subject<Message>();
  clearSource = new Subject<boolean>();

  messageAnnounced$ = this.messageAnnouncedSource.asObservable();
  clearChan$ = this.clearSource.asObservable();

  announceMessage(statusCode: number, message: string, alertType: AlertType) {
    this.messageAnnouncedSource.next(Message.newMessage(statusCode, message, alertType));
  }

  clear() {
    this.clearSource.next(true);
  }
}
