import { Component, ContentChildren, ElementRef, HostListener, Inject, Input, QueryList } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FloatWindowItemComponent } from './float-window-item/float-window-item.component';
import { EventManager } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

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
export class FloatWindowComponent {
  constructor(
    private el: ElementRef,
    private eventManager: EventManager,
    @Inject(DOCUMENT) private document: any
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

  @HostListener('mousedown', ['$event'])
  downEvent(evt) {
    const pos = {
      left: evt.offsetX,
      top: evt.offsetY
    };
    const target = this.getBox(evt.target);
    const shadow = this.document.createElement('div');
    shadow.style.cssText = 'position: fixed;width: 100%; height:100vh; z-index: 2; top: 0;';
    this.document.body.appendChild(shadow);
    this.eventList.push(
      this.eventManager.addGlobalEventListener('document', 'mousemove', this.moveEvent.bind(this, target, pos)),
      this.eventManager.addGlobalEventListener('document', 'mouseup', this.upEvent.bind(this, shadow))
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
    target.style.left = evt.clientX - pos.left + 'px';
    target.style.top = evt.clientY - pos.top + 'px';
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

  upEvent(shadow: HTMLElement) {
    this.eventList.forEach(item => {
      item();
    });
    this.eventList = [];
    this.document.body.removeChild(shadow);
  }

}
