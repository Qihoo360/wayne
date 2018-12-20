import { Component, OnDestroy } from '@angular/core';
import { createPatch } from 'diff';
import { Diff2Html } from 'diff2html';
import { DiffService } from './diff.service';
import { Subscription } from 'rxjs';
import { DiffTmp } from './diff';
import * as YAML from 'js-yaml';
import { MessageHandlerService } from '../message-handler/message-handler.service';
/**
 * instructions
 *
 * html :
 * <button class="wayne-button normal" (click)="diffTmp()">{{'BUTTON.DIFF_TMP' | translate}}</button>
 * ts:
 * diffTmp() {
 *  this.listDeployment.diffTmp();
 * }
 * list-html:
 * Datagrid add -> [(clrDgSelected)]="selected"
 * list-ts:
 * import { DiffService } from '../../../shared/diff/diff.service';
 *  selected: DeploymentTpl[] = [];
 *  private diffService: DiffService,
 *  diffTmp() {
 *    this.diffService.diff(this.selected);
 *  }
 */
@Component({
  selector: 'diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.scss']
})
export class DiffComponent implements OnDestroy {
  _style = true;
  _type = true;
  show = false;
  diffSubscription: Subscription;
  html = '';
  inputType = 'json';
  outStyle = 'side-by-side';
  diffTmp: DiffTmp;
  get style() {
    return this._style;
  }
  set style(value: boolean) {
    if (value !== undefined) {
      this._style = value;
      this.outStyle = value ? 'side-by-side' : 'line-by-line';
      this.createHtml();
    }
  }
  get type() {
    return this._type;
  }
  set type(value: boolean) {
    if (value !== undefined) {
      this._type = value;
      this.inputType = value ? 'json' : 'diff';
      this.createHtml();
    }
  }
  constructor(
    private service: DiffService,
    private messageService: MessageHandlerService
  ) {
    this.diffSubscription = this.service.diffOb.subscribe(
      (diffTmp) => {
        this.show = true;
        this.diffTmp = diffTmp;
        this.createHtml();
      }
    );
  }
  createHtml() {
    let oldstr: string, newStr: string;
    try {
      if (this.inputType === 'json') {
        oldstr = this.formatString(this.diffTmp.oldStr);
        newStr = this.formatString(this.diffTmp.newStr);
      } else {
        oldstr = YAML.dump(this.formatJson(this.diffTmp.oldStr));
        newStr = YAML.dump(this.formatJson(this.diffTmp.newStr));
      }
    } catch {
      oldstr = '';
      newStr = '';
      this.messageService.showError('SHARED.DIFF.CHECK_DATA');
    }
    try {
      const dd = createPatch(
        this.diffTmp.fileName,
        oldstr,
        newStr,
        this.diffTmp.newHeader,
        this.diffTmp.oldHeader
      );
      const outStr = Diff2Html.getJsonFromDiff(
        dd,
        { inputFormat: this.inputType, outputFormat: this.outStyle, showFiles: false, matching: 'lines' }
      );
      const html = Diff2Html.getPrettyHtml(
        outStr, { inputFormat: 'json', outputFormat: this.outStyle, showFiles: false, matching: 'lines' }
      );
      this.html = html;
    } catch {
      this.messageService.showError('SHARED.DIFF.TRANS_ERROR');
      this.html = null;
    }
  }

  ngOnDestroy() {
    this.diffSubscription.unsubscribe();
  }
  /**
   * @returns string by format
   */
  formatString(str: string): string {
    return JSON.stringify(JSON.parse(str), null, 4);
  }
  /**
   * @returns JSON by format
   */
  formatJson(str: string): JSON {
    return JSON.parse(str);
  }
}
