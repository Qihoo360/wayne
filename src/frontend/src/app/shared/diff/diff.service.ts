import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DiffTpl } from './diff';
import { MessageHandlerService } from '../message-handler/message-handler.service';
const defaultTmp: DiffTpl = {
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

  diffSub = new Subject<DiffTpl>();

  diffOb = this.diffSub.asObservable();

  diff(selected: any[], tmpPropName = 'template', namePropName = 'id') {
    const length = selected.length;
    let diffTpl;
    if (length < 2) {
      this.messageHandlerService.showError('SHARED.DIFF.TMP_LESS');
      return;
    } else {
      diffTpl = {
        oldStr: selected[1][tmpPropName],
        newStr: selected[0][tmpPropName],
        oldHeader: `${selected[0][namePropName]}`,
        newHeader: `${selected[1][namePropName]}`
      };
      if (length > 2) {
        this.messageHandlerService.showInfo('SHARED.DIFF.TMP_MORE');
      }
    }
    diffTpl = { ...defaultTmp, ...diffTpl };
    this.diffSub.next(diffTpl);
  }

}
