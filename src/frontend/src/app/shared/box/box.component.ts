import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'wayne-box',
  templateUrl: 'box.component.html',
  styleUrls: ['box.component.scss']
})

export class BoxComponent {
  constructor(private el: ElementRef) {
  }
  @HostListener('mouseenter')
  enterEvent() {
    this.el.nativeElement.style.boxShadow = '0px 4px 8px 0px #ccc';
  }
  @HostListener('mouseleave')
  leaveEvent() {
    this.el.nativeElement.style.boxShadow = '0px 0px 1px 0px #ccc';
  }
}
