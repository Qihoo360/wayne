import { Component, ElementRef, HostListener, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ScrollBarService } from '../client/v1/scrollBar.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EventManager } from '@angular/platform-browser';

@Component({
  selector: 'wayne-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  animations: [
    trigger('contentState', [
      state('show', style({height: '*'})),
      transition('* => void', [
        style({height: '*'}),
        animate(200, style({height: 0}))
      ])
    ]),
    trigger('barState', [
      state('show', style({opacity: 1})),
      state('hide', style({opacity: 0})),
      transition('show <=> hide', animate(100))
    ])
  ]
})

export class DropDownComponent implements OnInit {

  showContent = false;
  right: number | string = 0;
  width: number | string = 0;
  maxHeight = 400;
  marginRight = 0;
  barState = 'hide';
  barStyle = {
    height: 0,
    top: 0
  };
  clickStart: number = null;
  maxTrans: number;
  wrap: HTMLElement;
  barTopCache: number;
  eventList: any[] = new Array();
  // size 默认为空。如果传入small，则是最小自适应，传入middle，为50%宽度。
  @Input() size = '';
  // 这里是处理当item是最接近右边栏时候。采用right定位，防止出现滚动条。
  @Input() last;


  get translateY() {
    return `translateY(${this.barStyle.top}%)`;
  }

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private document: any,
    private scrollBar: ScrollBarService,
    private eventManager: EventManager
  ) {
    el.nativeElement.setAttribute('class', 'wanye-dropdown');
  }

  @HostListener('mouseenter')
  enterEvent() {
    const content = this.document.querySelector('.content-area');
    if (this.size === 'small' || this.size === 'middle') {
      this.right = 0;
    } else {
      this.right = -(this.document.body.clientWidth - this.getElementLeft(this.el.nativeElement)
        - this.el.nativeElement.offsetWidth - (content.scrollHeight > content.clientHeight ? 30 : 15));
    }
    this.width = this.size === 'small' ?
      'auto' :
      this.size === 'middle' ?
        this.document.body.offsetWidth / 2 :
        this.document.body.offsetWidth - (content.scrollHeight > content.clientHeight ? this.scrollBar.scrollBarWidth + 30 : 30);
    this.maxHeight = this.document.body.clientHeight - 80;
    this.marginRight = 0 - this.scrollBar.scrollBarWidth;
    this.showContent = true;
    setTimeout(() => {
      this.initBar();
    }, 0);
  }

  @HostListener('mouseleave')
  leaveEvent() {
    this.showContent = false;
  }

  ngOnInit() {
  }

  initBar() {
    this.wrap = this.el.nativeElement.querySelector('.scrollContent');
    if (this.wrap.clientHeight < this.wrap.scrollHeight) {
      this.barState = 'show';
    } else {
      this.barState = 'hide';
    }
    this.barStyle.height = Math.pow(this.wrap.clientHeight, 2) / this.wrap.scrollHeight || 0;
    this.maxTrans = Number(((this.wrap.clientHeight - this.barStyle.height) / this.barStyle.height * 100).toFixed(2));
  }

  scrollEvent(evt) {
    if (Object.prototype.toString.call(this.clickStart) !== '[object Null]') {
      return;
    }
    evt.stopPropagation();
    const target = evt.target;
    this.barStyle.top = Number((target.scrollTop / target.clientHeight * 100).toFixed(2));
  }

  moveEvent(target, evt) {
    evt.stopPropagation();
    evt.preventDefault();
    const move = this.barTopCache + Number(((evt.pageY - this.clickStart) / target.clientHeight * 100).toFixed(2));
    this.barStyle.top = move < 0 ? 0 : move < this.maxTrans ? move : this.maxTrans;
    this.wrap.scrollTop = this.barStyle.top / 100 * this.wrap.clientHeight;
  }

  upEvent(evt) {
    this.eventList.forEach(item => {
      item();
    });
    this.eventList = [];
    this.document.onselectstart = null;
    this.clickStart = null;
  }

  downEvent(evt) {
    this.clickStart = evt.pageY;
    const target = evt.target;
    this.barTopCache = this.barStyle.top;
    this.eventList.push(
      this.eventManager.addGlobalEventListener('document', 'mousemove', this.moveEvent.bind(this, target)),
      this.eventManager.addGlobalEventListener('document', 'mouseup', this.upEvent.bind(this))
    );
    this.document.onselectstart = () => false;
  }

  getElementLeft(el: any): number {
    let left = 0;
    while (el.tagName.toLowerCase() !== 'body') {
      left += el.offsetLeft;
      el = el.offsetParent;
    }
    return left;
  }

}
