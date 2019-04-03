import { Component, ContentChildren, HostBinding, ElementRef, HostListener, Inject, Input, QueryList, AfterViewInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FloatWindowItemComponent } from './float-window-item/float-window-item.component';
import { EventManager } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { StorageService } from '../client/v1/storage.service';

@Component({
  selector: 'wayne-float-window',
  templateUrl: './float-window.component.html',
  styleUrls: ['./float-window.component.scss'],
  animations: [
    trigger('boxState', [
      state('enter', style({
        right: '*'
      })),
      state('leave', style({
        right: '5000px'
      })),
      transition('* => enter', animate('0s')),
      transition('* => leave', animate('4ms 1s'))
    ])
  ]
})
/**
 * @Input name: 作为主按钮的文案
 * @demo:
 * <wayne-float-window value='cloudfdsafds'>
 <wayne-float-window-item value='1' tip='这里是1'></wayne-float-window-item>
 <wayne-float-window-item></wayne-float-window-item>
 <wayne-float-window-item></wayne-float-window-item>
 <wayne-float-window-item value='4'></wayne-float-window-item>
 </wayne-float-window>
 */
export class FloatWindowComponent implements AfterViewInit {
  @HostBinding('style.left') left: string;
  @HostBinding('style.top') top: string;
  constructor(
    private el: ElementRef,
    private eventManager: EventManager,
    @Inject(DOCUMENT) private document: any,
    private storage: StorageService
  ) {
    el.nativeElement.setAttribute('draggable', 'false');
  }

  @Input() value: string;
  boxState = 'leave';
  childs: QueryList<any>;
  eventList: any[] = new Array();

  @ContentChildren(FloatWindowItemComponent) set items(items: QueryList<any>) {
    this.childs = items;
    items.forEach((item, index) => {
      item.index = index;
      item.length = 4;
    });
  }

  ngAfterViewInit() {
    const local = this.storage.get('float-local');
    if (local) {
      const localParse = JSON.parse(local);
      setTimeout(() => {
        this.left = localParse.left;
        this.top = localParse.top;
      }, 0);
    }
  }

  @HostListener('mousedown', ['$event'])
  downEvent(evt) {
    const target = this.getBox(evt.target);
    const pos = {
      left: evt.offsetX + evt.target.getBoundingClientRect().left - target.getBoundingClientRect().left,
      top: evt.offsetY
    };
    const shadow = this.document.createElement('div');
    shadow.style.cssText = 'position: fixed;width: 100%; height:100vh; z-index: 2; top: 0;';
    this.document.body.appendChild(shadow);
    this.eventList.push(
      this.eventManager.addGlobalEventListener('document', 'mousemove', this.moveEvent.bind(this, target, pos)),
      this.eventManager.addGlobalEventListener('document', 'mouseup', this.upEvent.bind(this, target, shadow))
    );
  }

  @HostListener('mouseenter')
  enterEvent() {
    this.boxState = 'enter';
    this.childs.forEach(item => {
      item.boxState = 'enter';
    });
  }

  moveEvent(target, pos, evt) {
    this.left = evt.clientX - pos.left + 'px';
    this.top = evt.clientY - pos.top + 'px';
  }

  @HostListener('mouseleave')
  leaveEvent() {
    this.boxState = 'leave';
    this.childs.forEach(item => {
      item.boxState = 'leave';
    });
  }

  getBox(element: any): HTMLElement {
    while (element.tagName.toLocaleLowerCase() !== 'body') {
      element = element.parentElement;
      if (element.tagName.toLocaleLowerCase() === 'wayne-float-window') { break; }
    }
    return element;
  }

  upEvent(target: HTMLElement, shadow: HTMLElement) {
    this.storage.save('float-local', {
      left: target.style.left,
      top: target.style.top
    });
    this.eventList.forEach(item => {
      item();
    });
    this.eventList = [];
    this.document.body.removeChild(shadow);
  }

}
