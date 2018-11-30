import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  Output,
  QueryList
} from '@angular/core';
import { OptionComponent } from './option/option.component';
import { EventManager } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ScrollBarService } from '../client/v1/scrollBar.service';

@Component({
  selector: 'wayne-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),    // 这里指向当前组件
    multi: true
  }],
  animations: [
    trigger('boxState', [
      transition('void => *', [
        style({height: 0}),
        animate(100, style({height: '*'}))
      ]),
      transition('* => void', [
        style({height: '*'}),
        animate(100, style({height: '0'}))
      ])
    ]),
    trigger('barState', [
      state('show', style({opacity: 1})),
      state('hide', style({opacity: 0})),
      transition('show <=> hide', animate(100))
    ])
  ]
})

export class SelectComponent implements AfterViewInit, ControlValueAccessor {
  _value: any = '';
  barState: string = 'hide';
  showBox: boolean = false;
  updateEmit = (_: any) => {
  };
  top: number = 0;
  barHeight: number;
  maxTrans: number;
  wrap: HTMLElement;
  svg: HTMLElement;
  _options: QueryList<any>;
  barEventList: Array<any> = new Array();
  inputEventList: Array<any> = new Array();
  itemClickEventList: Array<any> = new Array();
  clickStart: number = null;
  barTopCache: number;
  marginRight: number;
  @Input('cursor') cursor = 'auto';
  @Input('readonly') readonly = false;
  @Input('type') type = '';
  @Input('placeholder') placeholder = '';
  @Output() change = new EventEmitter<any>();

  get value() {
    return this._value;
  }

  set value(value: any) {
    if (this._value !== value) {
      if (this.type === 'page') {
        this._value = parseInt(value) || null;
        if (this._value) this.updateValue(this._value);
      } else {
        this._value = value;
        this.updateValue(this._value);
      }
    }
  }

  inputEvent(evt) {
    evt.target.value = this.value;
  }

  constructor(
    private el: ElementRef,
    private eventManager: EventManager,
    @Inject(DOCUMENT) private document: any,
    private scrollService: ScrollBarService
  ) {
  }

  @ContentChildren(OptionComponent)
  set options(options: QueryList<any>) {
    this._options = options;
    this.removeCick();
    this.addClick(options);
    if (this.showBox) {
      this.initBar();
    }
  }

  ngAfterViewInit() {
    this.svg = this.el.nativeElement.querySelector('svg');
    this.marginRight = -this.scrollService.scrollBarWidth;
  }

  isClickBox(target: Element): boolean {
    while (target.tagName.toLowerCase() !== 'body') {
      if (target.tagName.toLowerCase() === 'wayne-select') return true;
      target = target.parentElement;
    }
    return false;
  }

  get barTop() {
    return `translateY(${this.top}%)`;
  }

  writeValue(value: any): void {
    if (value !== this.value) {
      this.value = value;
    }
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.updateEmit = fn;
  }

  registerOnTouched(fn: any): void {
  }

  addClick(options: QueryList<any>) {
    options.forEach((item, index) => {
      this.itemClickEventList.push(
        this.eventManager.addEventListener(item.el.nativeElement, 'click', this.clickEvent.bind(this, item.value, options))
      );
    });
  }

  removeCick() {
    this.itemClickEventList.forEach(item => {
      item();
    });
    this.itemClickEventList = [];
  }

  clickEvent(value, options: QueryList<any>, event) {
    this.removeStyle(options);
    event.target.style.background = 'rgba(232, 237, 246, .45)';
    this.value = value;
    this.destoryBar();
    this.showBox = false;
  }

  updateValue(value: any) {
    this.updateEmit(value);
    this.change.emit(value);
  }

  inputClickEvent(event) {
    this.showBox = !this.showBox;
    setTimeout(() => {
      if (this.showBox) {
        this.initBar();
      } else {
        this.destoryBar();
      }
    });
  }

  docuMouseDown(event) {
    let target = event.target;
    if (this.showBox) {
      if (!this.isClickBox(target)) {
        this.destoryBar();
        this.showBox = false;
      }
    } else {
      this.destoryBar();
    }
  }

  removeStyle(options: QueryList<any>) {
    options.forEach(item => {
      item.el.nativeElement.style.background = '';
    });
  }

  /**
   * bar 移动范围（0 ~ box - bar）
   * box 移动范围（0 ~ wrap - box）
   * 俩个后边正好是移动距离
   * (box - bar) / bar = (wrap -box) / box
   * percenet = scollTop / box
   */
  scrollEvent(event) {
    event.stopPropagation();
    if (Object.prototype.toString.call(this.clickStart) !== '[object Null]') return;
    const target = event.target;
    this.top = Number((target.scrollTop / target.clientHeight * 100).toFixed(2));
  }


  initBar() {
    this.svg.style.transform = 'rotateZ(90deg)';
    this.wrap = this.el.nativeElement.querySelector('.option-box');
    // 添加focus，防止滚动无效情况；
    this.wrap.focus();
    this.inputEventList.push(
      this.eventManager.addGlobalEventListener('document', 'click', this.docuMouseDown.bind(this))
    );
    this.top = 0;
    if (this.wrap.clientHeight < this.wrap.scrollHeight) {
      this.barHeight = Number((Math.pow(this.wrap.clientHeight, 2) / this.wrap.scrollHeight).toFixed(2));
      this.maxTrans = Number(((this.wrap.clientHeight - this.barHeight) / this.barHeight * 100).toFixed(2));
    } else {
      this.barHeight = 0;
    }
    this.removeStyle(this._options);
    this._options.forEach(option => {
      if (option.value == this.value) {
        option.el.nativeElement.style.background = 'rgba(232, 237, 246, .45)';
        this.wrap.scrollTop = option.el.nativeElement.offsetTop - 5;
      }
    });
  }

  destoryBar() {
    this.svg.style.transform = 'rotateZ(0)';
    this.wrap = null;
    this.inputEventList.forEach(item => {
      item();
    });
    this.inputEventList = [];
  }

  mouseDownEvent(event) {
    this.clickStart = event.pageY;
    this.barTopCache = this.top;
    this.barEventList.push(
      this.eventManager.addGlobalEventListener('document', 'mousemove', this.mouseMoveEvent.bind(this)),
      this.eventManager.addGlobalEventListener('document', 'mouseup', this.mouseUpEvent.bind(this))
    );
    // 这里使用addGlobalEventListener 挂载不上方法；防止滑动时候仍选择文本
    this.document.onselectstart = () => false;
  }

  mouseMoveEvent(event) {
    event.stopPropagation();
    event.preventDefault();
    const move = this.barTopCache + Number(((event.pageY - this.clickStart) / this.barHeight * 100).toFixed(2));
    this.top = move >= 0
      ? move <= this.maxTrans ? move : this.maxTrans
      : 0;
    this.wrap.scrollTop = this.top / 100 * this.wrap.clientHeight;
  }

  mouseUpEvent(event) {
    this.clickStart = null;
    this.barEventList.forEach(item => {
      item();
    });
    this.barEventList = [];
    this.document.onselectstart = null;
  }
}
