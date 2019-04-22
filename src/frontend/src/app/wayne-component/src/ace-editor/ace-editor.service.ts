import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AceEditorMsg } from './ace-editor';

@Injectable()
export class AceEditorService {

  aceMessageAnnouncedSource = new Subject<AceEditorMsg>();
  clearSource = new Subject<boolean>();

  aceMessageAnnouncedSource$ = this.aceMessageAnnouncedSource.asObservable();
  clearChan$ = this.clearSource.asObservable();

  announceMessage(message: AceEditorMsg) {
    this.aceMessageAnnouncedSource.next(message);
  }

  clear() {
    this.clearSource.next(true);
  }
}
