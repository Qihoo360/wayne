import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { TipService } from './tip.service';

@Directive({selector: '[wayneTip]'})
export class TipDirective implements OnDestroy {
  private _text: string;
  private _hover: boolean;
  private _top: number;
  private _left: number;

  constructor(
    private tipService: TipService,
    private eventManager: EventManager,
    private element: ElementRef
  ) {
    // this.eventManager.addEventListener(this.element, 'mouseenter', this.enterEvent.bind(this));
    // this.eventManager.addEventListener(this.element, 'mouseleave', this.leaveEvent.bind(this));
  }

  /**
   * 这里传值要分为俩种情况
   * 1. {@param} text: string;
   * 2. {@param} : descInfo;
   * class descInfo {
   *  [propName: string] :{
   *    top?: number;
   *    left?: number;
   *  }
   * }
   */
  @Input()
  set wayneTip(value: any) {
    if (this._hover) {
      this.tipService.close(this._text);
    }
    if (value) {
      this._text = value;
      if (this._hover) {
        this.enterEvent();
      }
    }
  }

  @Input()
  set top(value: number | string) {
    if (value || value === '0') {
      this._top = parseInt(value + '', 10);
      if (this._hover) {
        this.tipService.close(this._text);
        this.enterEvent();
      }
    }
  }

  @Input()
  set left(value: number | string) {
    if (value || value === '0') {
      this._left = parseInt(value + '', 10);
      if (this._hover) {
        this.tipService.close(this._text);
        this.enterEvent();
      }
    }
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event) {
    this.enterEvent();
  }

  enterEvent() {
    if (this._text) {
      const posiInfo = this.element.nativeElement.getClientRects()[0];
      const message = {
        top: this._top ? posiInfo.top + this._top : posiInfo.top,
        left: this._left ? posiInfo.left + this._left : posiInfo.left,
        text: this._text
      };
      this._hover = true;
      this.tipService.open(message);
    }
  }

  @HostListener('mouseleave') leaveEvent() {
    if (this._hover) {
      this._hover = false;
      this.tipService.closeTimeout(this._text);
    }
  }

  ngOnDestroy() {
    if (this._hover) {
      this.tipService.close(this._text);
    }
  }

}
