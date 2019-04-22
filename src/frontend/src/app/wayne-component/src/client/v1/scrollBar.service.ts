import { Inject, Injectable, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class ScrollBarService {

  scrollBarWidth: number;
  render: Renderer2;

  constructor(rendererFactory: RendererFactory2, private injector: Injector, @Inject(DOCUMENT) private document: HTMLElement) {
    this.render = rendererFactory.createRenderer(null, null);
  }

  init() {
    const div = this.render.createElement('div');
    div.style.cssText = 'position: absolute; left: -1000px; width: 100px; height: 100px;';
    this.render.appendChild(this.document.querySelector('body'), div);
    const divWidth = div.clientWidth;
    div.style.overflowY = 'scroll';
    const scrollWidth = div.clientWidth;
    this.render.removeChild(this.document.querySelector('body'), div);
    this.scrollBarWidth = divWidth - scrollWidth;
  }
}
