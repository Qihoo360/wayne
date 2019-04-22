import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

class Message {
  text: string;
  title?: string;
}


@Injectable()
export class TplDetailService {

  text = new Subject<Message>();

  text$ = this.text.asObservable();

  openModal(text: string, title?: string) {
    const msg = new Message();
    msg.text = text;
    if (title) { msg.title = title; }
    this.text.next(msg);
  }

}
