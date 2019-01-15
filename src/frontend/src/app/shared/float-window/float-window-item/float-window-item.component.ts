import { Component, Input, OnInit } from '@angular/core';
import { TipService } from '../../client/v1/tip.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'wayne-float-window-item',
  templateUrl: './float-window-item.component.html',
  styleUrls: ['./float-window-item.component.scss'],
  animations: [
    trigger('itemState', [
      state('active', style({
        transform: 'scale(1.1)'
      })),
      transition('* => active', animate('200ms cubic-bezier(0.645, 0.045, 0.355, 1)')),
      transition('active => *', animate('200ms 200ms cubic-bezier(0.645, 0.045, 0.355, 1)'))
    ])
  ]
})
/**
 * @Input tip: 作为悬浮上边的提示信息；
 */
export class FloatWindowItemComponent implements OnInit {

  index: number;
  length: number;
  boxState = 'leave';
  itemState = '';

  @Input() tip: string;
  @Input() value: string;

  constructor(private tipService: TipService) {
  }

  ngOnInit() {
  }

  get getStyle() {
    return {
      'transition-delay': this.boxState === 'enter' ? this.index * 60 + 'ms' : (this.length - 1 - this.index) * 60 + 'ms',
      'transform': this.boxState === 'enter' ? 'scale(1)' : 'scale(0)',
      'opacity': this.boxState === 'enter' ? '1' : '0'
    };
  }

  itemEnter(e) {
    const item = e.target;
    const itemInfo = item.getBoundingClientRect();
    if (this.tip !== undefined) {
      const info = {
        top: itemInfo.top,
        left: itemInfo.left + 13,
        text: this.tip
      };
      this.tipService.open(info);
    }
  }

  itemLeave() {
    if (this.tip !== undefined) {
      this.tipService.close(this.tip);
    }
  }

  downEvent() {
    this.itemState = 'active';
  }

  upEvent() {
    this.itemState = '';
  }
}
