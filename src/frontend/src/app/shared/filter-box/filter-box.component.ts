import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'wayne-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})

export class FilterBoxComponent implements OnInit {

  show: boolean;
  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  eventTarget: any;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventManage: EventManager,
    public translate: TranslateService) {
  }

  open() {
    this.show = true;
    this.eventTarget = this.eventManage.addGlobalEventListener('document', 'click', this.clickEvent.bind(this));
  }

  clickEvent(event) {
    if (this.isBox(event.target)) {
      return;
    }
    this._cancel();
  }

  isBox(target: HTMLElement): boolean {
    while (target && target.tagName.toLocaleLowerCase() !== 'body') {
      if (target.tagName.toLocaleLowerCase() === 'wayne-filter-box') {
        return true;
      }
      target = target.parentElement;
    }
    return false;
  }

  destroyEvent() {
    if (this.eventTarget) {
      this.eventTarget();
    }
    this.show = false;
  }

  ngOnInit() {

  }

  _confirm() {
    this.confirm.emit();
    this.destroyEvent();
  }

  _cancel() {
    this.cancel.emit();
    this.destroyEvent();
  }
}
