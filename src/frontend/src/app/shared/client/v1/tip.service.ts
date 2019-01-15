import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Message } from '../../model/v1/tip';

@Injectable()
export class TipService {
  dragEvent = false;
  private render: Renderer2;
  private _enter = false;
  eventList: Array<any> = new Array();

  constructor(rendererFactory: RendererFactory2,
              @Inject(DOCUMENT) private document: HTMLElement,
              private eventManage: EventManager
  ) {
    this.render = rendererFactory.createRenderer(null, null);
  }

  open(message: Message) {
    /**
     * @param {top: 触发块元素的全局top, left: 可视窗口left, text：信息, background: 背景色 }
     * @description 获取可是窗口信息可以使用getBoundingClientRect方法
     * 在样式中显示了显示长度是60，高度为260.宽度为250.
     */
    if (this.dragEvent) { return; }
    if (!message.background) { message.background = '#000'; }
    const tipDiv = this.render.createElement('div');
    const bodyHeight = this.document.querySelector('body').getBoundingClientRect().height;
    const span = this.render.createElement('span');
    tipDiv.className = 'tip-box';
    tipDiv.innerText = message.text.length > 60 ? message.text.slice(0, 60) + '...' : message.text;
    tipDiv.style = `bottom: ${bodyHeight - message.top + 10}px; left: ${message.left}px; background: ${message.background}`;
    span.style.color = message.background;
    this.render.appendChild(tipDiv, span);
    this.render.appendChild(this.document.querySelector('body'), tipDiv);
    this.eventList.push(
      this.eventManage.addEventListener(tipDiv, 'mouseenter', this.enterEvent.bind(this)),
      this.eventManage.addEventListener(tipDiv, 'mouseleave', this.leaveEvent.bind(this, message.text))
    );
  }

  enterEvent(event) {
    this._enter = true;
  }

  leaveEvent(text: string) {
    this._enter = false;
    this.close(text);
  }

  // 延时close
  closeTimeout(text: string) {
    setTimeout(() => {
      this.close(text);
    }, 0);
  }

  close(text: string) {
    if (this._enter) { return; }
    if (this.dragEvent) { return; }
    if (this.eventList.length !== 0) {
      this.eventList.forEach(item => {
        item();
      });
      this.eventList = [];
    }
    const tipDivs = this.document.querySelectorAll('div.tip-box');
    text = text.length > 60 ? text.slice(0, 60) + '...' : text;
    Array.prototype.slice.call(tipDivs).forEach(item => {
      if (item.innerText === text) {
        this.render.removeChild(this.document.querySelector('body'), item);
      }
    });
  }

  closeAll() {
    setTimeout(() => {
      Array.prototype.slice.call(this.document.querySelectorAll('div.tip-box')).forEach(item => {
        this.render.removeChild(this.document.querySelector('body'), item);
      });
    }, 0);
  }
}
