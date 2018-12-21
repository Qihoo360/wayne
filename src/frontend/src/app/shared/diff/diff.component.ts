import { Component, OnDestroy } from '@angular/core';
import { createPatch } from 'diff';
import { Diff2Html } from 'diff2html';
import { DiffService } from './diff.service';
import { Subscription } from 'rxjs';
import { DiffTpl } from './diff';
import * as YAML from 'js-yaml';
import { MessageHandlerService } from '../message-handler/message-handler.service';
/**
 * instructions
 *
 * html :
 * <button class="wayne-button normal" (click)="diffTpl()">{{'BUTTON.DIFF_TMP' | translate}}</button>
 * ts:
 * diffTpl() {
 *  this.listDeployment.diffTpl();
 * }
 * list-html:
 * Datagrid add -> [(clrDgSelected)]="selected"
 * list-ts:
 * import { DiffService } from '../../../shared/diff/diff.service';
 *  selected: DeploymentTpl[] = [];
 *  private diffService: DiffService,
 *  diffTpl() {
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
  diffTpl: DiffTpl;
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
      (diffTpl) => {
        this.show = true;
        this.diffTpl = diffTpl;
        this.createHtml();
      }
    );
  }
  createHtml() {
    let oldstr: string, newStr: string;
    try {
      if (this.inputType === 'json') {
        oldstr = this.formatString(this.diffTpl.oldStr);
        newStr = this.formatString(this.diffTpl.newStr);
      } else {
        oldstr = YAML.dump(this.formatJson(this.diffTpl.oldStr));
        newStr = YAML.dump(this.formatJson(this.diffTpl.newStr));
      }
    } catch {
      oldstr = '';
      newStr = '';
      this.messageService.showError('SHARED.DIFF.CHECK_DATA');
    }
    try {
      const dd = createPatch(
        this.diffTpl.fileName,
        oldstr,
        newStr,
        this.diffTpl.newHeader,
        this.diffTpl.oldHeader
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
