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
  QueryList,
  OnInit
} from '@angular/core';
import { OptionComponent } from './option/option.component';
import { EventManager } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ScrollBarService } from '../client/v1/scrollBar.service';

interface ListText {
  text: string;
}
interface ListValue {
  value: string;
}
const splitString = '#%$';
const boxPadding = 33;

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

export class SelectComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  /**
   * 三种参数：
   * inputable 可输入select，对于不存在 value 的参数，得到 text 值作为 value 返回。此属性不能与 multiple 共用。
   * searchable 可搜索 select，可搭配其他使用
   * multiple 多选 select，不能搭配 inputable 使用。
   * 配置参数：
   * direction : auto / top / bottom;
   * cursor;
   * placeholder;
   *  */
  _value: any = '';
  _filterValue = '';
  _showBox = false;
  // multiple value
  _values: Set<any> = new Set();
  barState = 'hide';
  top = 0;
  barHeight: number;
  maxTrans: number;
  wrap: HTMLElement;
  svg: HTMLElement;
  _options: QueryList<any>;
  globalEventList: Array<any> = new Array();
  barEventList: Array<any> = new Array();
  inputEventList: Array<any> = new Array();
  itemClickEventList: Array<any> = new Array();
  clickStart: number = null;
  barTopCache: number;
  marginRight: number;
  // store text -> value;
  listText: any;
  listValue: any;
  dire: string;
  multText = '';
  @Input('searchable') searchable;
  get search(): boolean {
    return (this.searchable === undefined || this.searchable === false) ? false : true;
  }
  @Input('inputable') inputable;
  get input(): boolean {
    return (this.inputable === undefined || this.inputable === false) ? false : true;
  }
  @Input('multiple') multiple;
  get mult(): boolean {
    return  (this.multiple === undefined || this.multiple === false) ? false : true;
  }
  @Input('readonly') readonly;
  get read(): boolean {
    return !this.mult && (this.input || (this.readonly !== undefined && this.readonly === false)) ? false : true;
  }
  @Input() direction = 'auto';
  @Input('cursor') cursor = 'pointer';
  @Input('placeholder') placeholder = '';
  @Output() change = new EventEmitter<any>();
  updateEmit = (_: any) => {};

  get value() {
    return this._value;
  }

  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      if (this.mult) {
        this.updateValue(this.stringToValue(value));
      } else if (this.input) {
        if (this._value) {
          // pagination 下为了保证不为null，0 报错
          this.updateValue(this.listText[this._value] !== undefined ? this.listText[this._value] : this._value);
        }
      } else {
        if (!this.listText) {
          return;
        }
        this.updateValue(this.listText[this._value] !== undefined ? this.listText[this._value] : '');
      }
      this.setActive(this._value);
    }
  }

  get filterValue() {
    return this._filterValue;
  }

  set filterValue(value: any) {
    if (this._filterValue !== value) {
      this._filterValue = value;
      if (this.search) {
        this._options.forEach(item => {
          if (value == null || value === undefined || item.el.nativeElement.innerText.indexOf(value) > -1) {
            item.el.nativeElement.classList.remove('hide');
          } else {
            item.el.nativeElement.classList.add('hide');
          }
        });
      }
    }
  }

  get showBox(): boolean {
    return this._showBox;
  }

  set showBox(show: boolean) {
    this._showBox = show;
    if (show) {
      this.resizeEvent();
      setTimeout(() => {
        this.globalEventList.push(
          this.eventManager.addGlobalEventListener('window', 'resize', this.resizeEvent.bind(this)),
          this.eventManager.addEventListener(this.document.querySelector('.content-area'), 'scroll', this.resizeEvent.bind(this))
        );
      }, 100);
    } else {
      this.globalEventList.forEach(event => {
        event();
      });
    }
  }

  constructor(
    private el: ElementRef,
    private eventManager: EventManager,
    @Inject(DOCUMENT) private document: any,
    private scrollService: ScrollBarService
  ) {
  }

  ngOnInit() {
    this.dire = this.direction === 'top' ? 'top' : 'bottom';
    if (this.mult && this.input) {
      console.warn('inputable 属性和 searchable 不能共用');
    }
  }

  ngAfterViewInit() {
    this.svg = this.el.nativeElement.querySelector('svg');
    this.marginRight = -this.scrollService.scrollBarWidth;
  }

  inputEvent(evt) {
    evt.target.value = this.value;
  }
  /**
   * option
   *  */
  @ContentChildren(OptionComponent)
  set options(options: QueryList<any>) {
    this._options = options;
    this.removeCick();
    this.initOption(options);
    this.setActive(this.value);
    if (this.showBox) {
      this.initBar();
    }
  }

  initOption(options: QueryList<any>) {
    this.listText = {};
    this.listValue = {};
    options.forEach((item, index) => {
      const element = item.el.nativeElement;
      this.listText[element.innerText] = item.value;
      this.listValue[item.value] = element.innerText;
      this.itemClickEventList.push(
        this.eventManager.addEventListener(element, 'click', this.clickEvent.bind(this, element.innerText, options))
      );
    });
    // async init option function
    if (this.value !== '') {
      setTimeout(() => {
        if (this.mult) {
          this.value = this.valueToString();
        } else {
          this.value = this.listText[this.value] === undefined && this.listValue[this.value] !== undefined ? this.listValue : this.value;
        }
      });
    }
  }

  setActive(value: string) {
    if (value == null) {
      return;
    }
    const textList = new Set();
    if (this.mult) {
      this.multText.split(splitString).forEach(item => {
        textList.add(this.listText[item]);
      });
    } else {
      textList.add(this.listText[value]);
    }
    this._options.forEach(item => {
      if (textList.has(item.value)) {
        item.el.nativeElement.classList.add('active');
      } else {
        item.el.nativeElement.classList.remove('active');
      }
    });
  }

  removeCick() {
    this.itemClickEventList.forEach(item => {
      item();
    });
    this.itemClickEventList = [];
  }

  isClickBox(target: Element): boolean {
    while (target && target.tagName.toLowerCase() !== 'body') {
      if (target.tagName.toLowerCase() === 'wayne-select') {
        return true;
      }
      target = target.parentElement;
    }
    return false;
  }

  get barTop() {
    return `translateY(${this.top}%)`;
  }

  clickEvent(text, options: QueryList<any>, event) {
    this.removeStyle(options);
    event.target.style.background = 'rgba(232, 237, 246, .45)';
    if (this.mult) {
      const value = this.listText[text];
      if (this._values.has(value)) {
        this._values.delete(value);
      } else {
        this._values.add(value);
      }
      this.value = this.valueToString();
    } else {
      this.value = text;
      this.destoryBar();
      this.showBox = false;
    }
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
    const target = event.target;
    if (this.showBox) {
      if (!this.isClickBox(target)) {
        this.destoryBar();
        this.showBox = false;
      }
    } else {
      this.destoryBar();
    }
  }

  getBoxHeight(): number {
    return (boxPadding + this._options.length * 25) > 200 ? 200 : boxPadding + this._options.length * 25;
  }

  resizeEvent() {
    if (this.direction === 'auto') {
      // 去除 header 高度
      const headerHeight = 60;
      const bodyHeight = this.document.body.offsetHeight;
      const target = this.el.nativeElement.querySelector('.select-box');
      const { top, bottom } = this.el.nativeElement.getBoundingClientRect();
      const targetHeight = this.getBoxHeight();
      if (this.dire === 'top') {
        if (top - headerHeight - targetHeight <= 0 && bodyHeight - bottom - targetHeight > 0) {
          this.dire = 'bottom';
        }
      } else {
        if (top - headerHeight - targetHeight >= 0 && bodyHeight - bottom - targetHeight < 0) {
          this.dire = 'top';
        }
      }
    }
  }

  removeStyle(options: QueryList<any>) {
    options.forEach(item => {
      item.el.nativeElement.style.background = '';
    });
  }

  /**
   * mult 下 this._values -> string
   * 全局变量 this._values, this.listValue
   *  */
  valueToString() {
    const arr = Array.from(this._values).map(res => {
      return this.listValue[res] ? this.listValue[res] : res;
    });
    this.multText = arr.join(splitString);
    return arr.join(', ');
  }
  /**
   * mult 下 string -> array
   * 全局变量 this._values, this.listText
   */
  stringToValue(text: string) {
    const result = [];
    this.multText.split(splitString).forEach(item => {
      const value = this.listText[item] !== undefined
        ? this.listText[item]
        : this.listValue[item] !== undefined
          ? this.listValue[item]
          : item;
      result.push(value);
    });
    return result;
  }

  /**
   * update value;
   *  */
  writeValue(value: any): void {
    if (this.mult) {
      // array -> string;
      if (value && value.toString() !== this.value) {
        if (Object.prototype.toString.call(value) === '[object Array]') {
          this._values.clear();
          value.forEach(item => {
            this._values.add(item);
          });
          this.value = this.valueToString();
        } else {
          this.value = '';
        }
      } else {
        this.value = '';
      }
    } else {
      // value -> text;
      if (value !== this.value) {
        if (this.input) {
          this.value = value;
        } else {
          if (this.listValue) {
            this.value = this.listValue[value] !== undefined ? this.listValue[value] : value;
          } else {
            this.value = value;
          }
        }
      }
    }
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.updateEmit = fn;
  }

  registerOnTouched(fn: any): void {
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
    if (Object.prototype.toString.call(this.clickStart) !== '[object Null]') {
      return;
    }
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
      if (option.value === this.value) {
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
