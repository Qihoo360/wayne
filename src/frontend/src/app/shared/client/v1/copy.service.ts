import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MessageHandlerService } from '../../message-handler/message-handler.service';

@Injectable()
export class CopyService {
  private textarea: HTMLInputElement | HTMLTextAreaElement;
  render: Renderer2;

  constructor(
    @Inject(DOCUMENT) private document: any,
    rendererFactory: RendererFactory2,
    private messageService: MessageHandlerService,
  ) {
    this.render = rendererFactory.createRenderer(null, null);
  }

  /**
   * @description 监测是否支持复制功能
   */
  get supported(): boolean {
    return !!this.document.queryCommandSupported && !!this.document.queryCommandSupported('copy');
  }

  private createText(value: any, parent: HTMLElement, render: Renderer2): HTMLInputElement | HTMLTextAreaElement {
    const textarea = render.createElement('textarea');
    textarea.style.cssText = `position: fixed; left: 100px;width: 100px;height: 100px;left: 200px;top: 40px;z-index: 1050`;
    textarea.value = value;
    render.appendChild(parent, textarea);
    return textarea;
  }

  /**
   * @description 复制被选择文本
   * @param document InjectionToken<Document>
   */
  private copyText(): boolean {
    return this.document.execCommand('copy');
  }

  private selectText(textElement: HTMLInputElement | HTMLTextAreaElement): boolean {
    try {
      textElement.select();
      textElement.setSelectionRange(0, textElement.value.length);
      return true;
    } catch (error) {
      return false;
    }
  }

  private removeText(textElement: HTMLInputElement | HTMLTextAreaElement, window: any, parent: HTMLElement, render: Renderer2) {
    textElement.blur();
    window.getSelection().removeAllRanges();
    render.removeChild(parent, textElement);
  }

  private judgeModal() {
    if (this.document.querySelector('.modal') && this.document.querySelector('.modal').hasAttribute('tabindex')) {
      this.document.querySelector('.modal').removeAttribute('tabindex');
    }
  }

  copy(value: any) {
    if (this.supported) {
      // 1. 选择文本；
      const appendBody = this.document.body;
      const textElement = this.createText(value, appendBody, this.render);
      try {
        this.judgeModal();
        const selectResult = this.selectText(textElement);
        const result = this.copyText();
        this.removeText(textElement, window, appendBody, this.render);
        if (selectResult && result) {
          this.messageService.showSuccess(`${value}复制成功`);
        } else {
          this.messageService.showError('copy 失败');
        }
      } catch (error) {
        this.messageService.showError('copy 失败');
      }
    } else {
      this.messageService.showError('copy 命令不支持');
    }
  }
}
