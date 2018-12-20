import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DiffTmp } from './diff';
import { MessageHandlerService } from '../message-handler/message-handler.service';
const defaultTmp: DiffTmp = {
  fileName: '',
  oldStr: '',
  newStr: '',
  oldHeader: 'before',
  newHeader: 'after'
};

@Injectable()
export class DiffService {

  constructor(
    private messageHandlerService: MessageHandlerService
  ) {

  }

  diffSub = new Subject<DiffTmp>();

  diffOb = this.diffSub.asObservable();

  diff(selected: any[], tmpPropName = 'template', namePropName = 'id') {
    const length = selected.length;
    let diffTmp;
    if (length < 2) {
      this.messageHandlerService.showError('SHARED.DIFF.TMP_LESS');
      return;
    } else {
      diffTmp = {
        oldStr: selected[1][tmpPropName],
        newStr: selected[0][tmpPropName],
        oldHeader: `${selected[1][namePropName]}`,
        newHeader: `${selected[0][namePropName]}`
      };
      if (length > 2) {
        this.messageHandlerService.showInfo('SHARED.DIFF.TMP_MORE');
      }
    }
    diffTmp = { ...defaultTmp, ...diffTmp };
    this.diffSub.next(diffTmp);
  }

}
