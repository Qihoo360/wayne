import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DiffTmp } from './diff';

const defaultTmp: DiffTmp = {
  fileName: '',
  oldStr: '',
  newStr: '',
  oldHeader: 'before',
  newHeader: 'after'
};

@Injectable()
export class DiffService {

  diffSub = new Subject<DiffTmp>();

  diffOb = this.diffSub.asObservable();

  diff(diffTmp: DiffTmp) {
    diffTmp = { ...defaultTmp, ...diffTmp };
    this.diffSub.next(diffTmp);
  }

}
