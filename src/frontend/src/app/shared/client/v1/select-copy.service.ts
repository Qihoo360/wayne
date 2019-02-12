import { AfterViewInit, Inject, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EventManager } from '@angular/platform-browser';
import { CopyService } from './copy.service';

@Injectable()

export class SelectCopyService implements OnDestroy, AfterViewInit {

  render: Renderer2;
  range = 30;
  globalEventList: Array<any> = new Array();
  scrollBoxList: Array<any> = new Array();
  isCopy = false;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventManage: EventManager,
    rendererFactory: RendererFactory2,
    private copyService: CopyService
  ) {
    this.render = rendererFactory.createRenderer(null, null);
  }

  isButton(element: any): boolean {
    while (element.tagName.toLowerCase() !== 'body') {
      if (element.tagName.toLowerCase() === 'button') {
        return true;
      }
      element = element.parentNode;
    }
    return false;
  }

  isCopyButton(element: any): boolean {
    while (element.tagName && element.tagName.toLowerCase() !== 'body') {
      if (element.id === 'copy-button') {
        return true;
      }
      element = element.parentNode;
    }
    return false;
  }

  isInput(element: any): boolean {
    return element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea';
  }

  get supportSelection() {
    return this.document.selection;
  }

  init() {
    if (window) {
      this.globalEventList.push(
        this.eventManage.addGlobalEventListener('document', 'mouseup', this.mouseUpEvent.bind(this)),
        this.eventManage.addGlobalEventListener('document', 'mousedown', this.mouseDownEvent.bind(this))
      );
    }
  }

  // 滚动时候清除button
  boxAddScroll(target) {
    while (target.tagName && target.tagName.toLowerCase() !== 'html') {
      if (target.offsetHeight < target.scrollHeight || target.offsetWidth < target.scrollWidth) {
        this.scrollBoxList.push(this.eventManage.addEventListener(target, 'scroll', this.cancelCopyEvent.bind(this, target)));
      }
      target = target.parentNode;
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.globalEventList.length !== 0) {
      this.globalEventList.forEach(item => {
        item();
      });
      this.globalEventList = [];
    }
  }

  cancelCopyEvent(element: any) {
    if (this.isCopy) {
      this.removeCopyButton();
    }
  }

  removeCopyButton() {
    if (this.scrollBoxList.length !== 0) {
      this.scrollBoxList.forEach(item => {
        item();
      });
      this.scrollBoxList = [];
    }
    [].slice.call(this.document.querySelectorAll('#copy-button')).forEach(item => {
      this.render.removeChild(this.document.body, item);
    });
  }

  mouseUpEvent(event) {
    const target = event.target;
    if (this.getSelectText().trim() === '') {
      return;
    }
    if (this.isButton(target) || this.isCopyButton(target)) {
      return;
    }
    const dom = this.render.createElement('div');
    dom.id = 'copy-button';
    const result = this.buttonPosition(event, this.getSelectPosition());
    dom.style.cssText = `width: 30px;height: 30px; position: fixed;z-index: 1051;left: ${result.left}px; top: ${result.top}px`;
    dom.innerHTML = '<svg width="25" height="25" class="copy-svg" viewBox="0 0 448 512">' +
      '<path fill="black" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 ' +
      '24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c' +
      '13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h' +
      '96v-6.059a24 24 0 0 0-7.029-16.97z"></path></svg>';
    this.render.appendChild(this.document.body, dom);
    this.boxAddScroll(target);
    this.isCopy = true;
  }

  mouseDownEvent(event) {
    const eventDom = event.target;
    if (this.isCopyButton(eventDom)) {
      this.copyService.copy(this.getSelectText());
    }
    this.removeCopyButton();
    if (this.isAceBox(eventDom)) { return; }
    this.removeSelect();
  }

  isAceBox(element: any): Boolean {
    while (element.tagName.toLowerCase() !== 'body') {
      if (element.classList.contains('ace_content')) {
        return true;
      }
      element = element.parentNode;
    }
    return false;
  }

  removeSelect() {
    this.supportSelection ? this.document.selection.removeAllRanges() : this.document.getSelection().removeAllRanges();
  }

  buttonPosition(event: any, selectPosi: any) {
    if (this.isInput(event.target)) {
      return {left: event.clientX + 5, top: event.clientY - 40};
    } else {
      // 通过高度来判断多行情况
      if (selectPosi.height > this.range) {
        if (Math.abs(selectPosi.top + selectPosi.height - event.clientY) < this.range) {
          // 说明是从上往下滑动
          return {left: event.clientX + 5, top: event.clientY + 10};
        } else {
          return {left: event.clientX + 5, top: event.clientY - 40};
        }
      } else {
        // 当行使用selectPosi定位较为精确。
        if (Math.abs(selectPosi.left - event.clientX) < this.range) {
          // 从右向左
          return {left: selectPosi.left + 2, top: selectPosi.top - 32};
        } else {
          return {left: selectPosi.right + 2, top: selectPosi.bottom + 2};
        }
      }
    }
  }

  getSelectText(): string {
    return this.supportSelection ? this.document.selection.createRange().text : this.document.getSelection().toString();
  }

  getSelectPosition() {
    return this.supportSelection ?
      this.document.selection.createRange().getBoundingClientRect() : this.document.getSelection().getRangeAt(0).getBoundingClientRect();
  }
}
