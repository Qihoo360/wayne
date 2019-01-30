import { Inject, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { TipService } from './tip.service';
import { DOCUMENT } from '@angular/common';

/**
 * angular 自己的组件高度都为0，所以只能在实际dom上添加draggable;
 */
@Injectable()
export class TabDragService implements OnDestroy {
  // dragenter tab切换
  private tabChange = new Subject<boolean>();
  tabChangeObservable = this.tabChange.asObservable();
  // dragover
  private tabDragOver = new Subject<boolean>();
  tabDragOverObservable = this.tabDragOver.asObservable();

  target: any;
  parentNode: any;
  eventList: Array<any> = new Array();
  render: Renderer2;
  tabDrag = false;
  ms = 150;
  repainer: any;
  // 左右按钮
  private controlTrans = new Subject<string>();
  controlTransObservable = this.controlTrans.asObservable();

  changeTrans(direction: string) {
    this.controlTrans.next(direction);
  }

  tabChangeEvent(change: boolean) {
    this.tabChange.next(change);
  }

  tabDragOverEvent(over: boolean) {
    this.tabDragOver.next(over);
  }

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventManage: EventManager,
    private rendererFactory: RendererFactory2,
    private tipService: TipService
  ) {
    this.render = rendererFactory.createRenderer(null, null);
  }

  init(el: HTMLElement) {
    this.eventList.push(
      this.eventManage.addEventListener(el, 'dragenter', this.handleEvent.bind(this)),
      this.eventManage.addEventListener(el, 'dragstart', this.handleEvent.bind(this)),
      this.eventManage.addEventListener(el, 'dragover', this.handleEvent.bind(this)),
      this.eventManage.addEventListener(el, 'dragend', this.handleEvent.bind(this))
    );
  }

  over() {
    this.eventList.forEach(item => {
      item();
    });
  }

  handleEvent(evt: any) {
    switch (evt.type) {
      case 'dragstart':
        this.startEvent(evt);
        break;

      case 'dragenter':
      case 'dragover':
        this.overEvent(evt);
        break;

      case 'dragend':
        this.endEvent(evt);
        break;
    }
  }

  startEvent(evt: any) {
    if (this.isBoxItem(evt.target)) {
      this.tabDrag = true;
      this.tipService.closeAll();
      this.tipService.dragEvent = true;
      this.setTargetCss(evt.target);
      this.target = evt.target;
      this.parentNode = this.target.parentNode;
    }
  }

  overEvent(evt: any) {
    // 组织默认事件可以帮助控制鼠标样式。
    evt.preventDefault();
    if (this.tabDrag) {
      if (this.target.animated) {
        return;
      }
      let toElement = this.getBox(evt.target);
      if (this.isBoxItem(toElement) && toElement !== this.target) {
        const fromElement = this.target;
        toElement = this.isBeforeItem(fromElement, toElement) ?
          this.getSilbingItem(fromElement, false) : this.getSilbingItem(fromElement, true);
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        this.insertElement(toElement, fromElement);
        this.animate(fromRect, fromElement);
        this.animate(toRect, toElement);
      }
      if (evt.target.classList.contains('tabs-next')) {
        this.changeTrans('right');
      } else if (evt.target.classList.contains('tabs-prev')) {
        this.changeTrans('left');
      }
    }
  }

  endEvent(evt: any) {
    if (this.tabDrag) {
      this.tipService.dragEvent = false;
      this.resetTargetCss(evt.target);
      this.tabDrag = false;
      this.tabDragOverEvent(true);
    }
  }

  setTargetCss(target: Element) {
    this.setCss(target, 'background', '#f2f2f2');
    this.setCss(target, 'border-radius', '4px');
    this.setCss(target, 'box-shadow', 'rgb(204, 204, 204) 0px 1px 5px inset, ' +
      'rgb(204, 204, 204) 1px 0px 5px inset, rgba(204, 204, 204, 0.8) -1px 0px 5px inset, rgb(204, 204, 204) -1px 0px 5px inset');
  }

  resetTargetCss(target: Element): void {
    this.setCss(target, 'background', '');
    this.setCss(target, 'border-radius', '');
    this.setCss(target, 'box-shadow', '');
  }

  insertElement(anotherEl: Element, targetEl: Element): void {
    this.render.insertBefore(this.parentNode, targetEl, this.isBeforeItem(targetEl, anotherEl) ?
      this.getBox(anotherEl).nextElementSibling : this.getBox(anotherEl));
  }

  animate(prevRect: any, el: any) {
    const currentRect = el.getBoundingClientRect();
    this.setCss(el, 'transition', '');
    this.setCss(el, 'transform', `translateX(${prevRect.left - currentRect.left}px)`);
    this.repainer = el.offsetWidth;
    this.setCss(el, 'transition', `transform ${this.ms}ms cubic-bezier(0.3, 0.7, 0.7, 0.3)`);
    this.setCss(el, 'transform', 'translateX(0)');
    el.animated = setTimeout(() => {
      this.setCss(el, 'transition', '');
      this.setCss(el, 'transform', '');
      el.animated = false;
      this.tabChangeEvent(true);
    }, this.ms);
  }

  setCss(el, prop, val) {
    const style = el && el.style;

    if (style) {
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }

        return prop === void 0 ? val : val[prop];
      } else {
        if (!(prop in style)) {
          prop = '-webkit-' + prop;
        }

        style[prop] = val + (typeof val === 'string' ? '' : 'px');
      }
    }
  }

  isTabChild(element: any): boolean {
    while (element.tagName.toLowerCase() !== 'body') {
      if (element.tagName.toLowerCase === 'wayne-tab') {
        return true;
      }
      element = element.parentNode;
    }
    return false;
  }

  isBoxItem(element): boolean {
    try {
      return element.tagName.toLowerCase() === 'wayne-tab';
    } catch (error) {
      return false;
    }
  }

  isListChild(element: any): boolean {
    if (element) {
      while (element.tagName.toLowerCase() !== 'body' && !element.classList.contains('tabs-list')) {
        element = element.parentNode;
      }
      return element.tagName.toLowerCase() !== 'body';
    }
    return false;
  }

  /**
   *
   * @param a a.tabs-list
   * @param b b.tabs-list
   * @returns a 是否在 b元素前边
   */
  isBeforeItem(a: any, b: any): boolean {
    while (a) {
      a = a.nextElementSibling;
      if (a === b) {
        return true;
      }
    }
    return false;
  }

  getSilbingItem(a: Element, before: boolean): Element {
    return before ? a.previousElementSibling : a.nextElementSibling;
  }

  getBox(element: any): Element {
    while (element.tagName && element.tagName.toLowerCase() !== 'wayne-tab') {
      element = element.parentNode;
    }
    return element;
  }

  ngOnDestroy() {

  }

}
