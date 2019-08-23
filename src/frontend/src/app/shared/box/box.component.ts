import { Component, HostListener, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'wayne-box',
  templateUrl: 'box.component.html',
  styleUrls: ['box.component.scss']
})

export class BoxComponent {
  enter: boolean;
  @Input() disabled: boolean;
  @HostBinding('class.box-disabled')
  get boxDisabled() {
    return this.disabled;
  }
  @HostBinding('style.boxShadow')
  get shadow() {
    return this.disabled ? '' : this.enter ? '0px 4px 8px 0px #ccc' : '0px 0px 1px 0px #ccc';
  }
  @HostListener('mouseenter')
  enterEvent() {
    this.enter = true;
  }
  @HostListener('mouseleave')
  leaveEvent() {
    this.enter = false;
  }
}
