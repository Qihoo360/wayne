import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PublishHistory } from '../model/v1/publish-history';
import { PublishType } from '../shared.const';

@Injectable()
export class PublishHistoryService {

  history = new Subject<PublishHistory>();

  publishHistory$ = this.history.asObservable();

  openModal(type: PublishType, resourceId: number) {
    const publishHistory = new PublishHistory();
    publishHistory.type = type;
    publishHistory.resourceId = resourceId;
    this.history.next(publishHistory);
  }

}
