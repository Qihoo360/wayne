import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3Scale from 'd3-scale';
import { interpolateRdYlGn } from 'd3-scale-chromatic';
import { TipService } from '../client/v1/tip.service';

@Component({
  selector: 'wayne-progress',
  templateUrl: 'progress.component.html',
  styleUrls: ['progress.component.scss']
})

export class ProgressComponent implements OnInit {

  private _enter: boolean = false;
  private _timer: any;
  Infinity: number = Infinity;
  colorRange: any;

  constructor(private tipService: TipService) {

  }

  ngOnInit() {
    this.colorRange = d3Scale.scaleSequential(interpolateRdYlGn)
      .domain([100, 0]);
  }

  @Input() label: string;
  @Input() count: number | string;
  @Input() total: number | string;
  @Input() text: boolean = true;
  @ViewChild('box') box: ElementRef;

  get percent(): number {
    if (typeof parseFloat(this.count + '') === 'number' && typeof parseFloat(this.total + '') === 'number') {
      return parseInt(parseInt(this.count + '') / parseFloat(this.total + '') * 100 + '');
    } else {
      return 0;
    }
  }

  get endColor() {
    return '#377aec';
    // return this.colorRange(this.percent);
  }

  // 设置timer是防止鼠标出于边界会一直触发enter和leave的动作,做到进入一次短时间离开再进入不动作。
  enterEvent() {
    if (this._timer) clearTimeout(this._timer);
    if (this._enter) return;
    this._enter = true;
    const posi = this.box.nativeElement.getBoundingClientRect();
    let info = {
      left: Math.floor(posi.left),
      top: Math.floor(posi.top),
      background: this.endColor,
      text: `${this.count} / ${this.total}`
    };
    this.tipService.open(info);
  }

  leaveEvent() {
    this._timer = setTimeout(() => {
      this._enter = false;
      let info = `${this.count} / ${this.total}`;
      this.tipService.close(info);
    }, 100);
  }
}
