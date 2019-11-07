import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import * as echarts from 'echarts';
import { Data } from './gauge';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;

@Component({
  selector: 'echarts-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})

export class EchartsGaugeComponent implements AfterViewInit {
  /**
   * 可传参数：
   *  save: saveAsImage, 默认不打开
   *  title: 标题
   *  name: 名称
   *  type: {
   *    'percent', 百分比显示，默认最大 100
   *    'number', 需要提供最大值即 max
   *  }
   *  data: number[] 数值
   *  min: number 起点，默认为0
   *  max: number 当 type 不是 percent 时候，传入max
   *  tooltip 定制化的tip显示
   *  reverse 颜色是否呈反向显示
   */
  _title: string;
  _save: boolean;
  _name: string;
  _type: string;
  _data: number[];
  _tooltip: string;
  _reverse = false;
  _min = 0;
  _max = 100;
  @ViewChild('view', { static: false }) view;
  @Input('save')
  set save(value: boolean) {
    this._save = value || false;
    this.initOption();
  }
  @Input('title')
  set title(value: string) {
    if (value !== undefined) {
      this._title = value;
      this.initOption();
    }
  }
  @Input('name')
  set name(value: string) {
    this._name = value;
    this.initOption();
  }
  @Input('type')
  set type(value: string) {
    this._type = value;
    this.initOption();
  }
  @Input('reverse')
  set reverse(value: any) {
    if (value !== undefined) {
      this._reverse = true;
    }
  }
  @Input('data')
  set data(value: number[]) {
    this._data = value || [];
    this.initOption();
  }
  @Input('min')
  set min(value: number) {
    this._min = value || 0;
    this.initOption();
  }
  @Input('max')
  set max(value: number) {
    this._max = value || 100;
    this.initOption();
  }
  @Input('tooltip')
  set tooltip(value: string) {
    this._tooltip = value;
    this.initOption();
  }

  get chartData(): Data[] {
    return this._data.map(item => {
      return {
        value: item,
        name: this._name
      };
    });
  }

  chart: ECharts;
  get option(): EChartOption {
    return {
      title: {
        text: this._title,
        left: 'center',
        top: '15px',
        textStyle: {
          color: '#333',
          fontSize: 20,
          letterSpacing: '2px'
        }
      },
      tooltip: {
        formatter: this._tooltip ? this._tooltip : this._type === 'percent' ? '{b} : {c}%' : '{b} : {c}'
      },
      toolbox: {
        feature: {
          saveAsImage: this._save
        }
      },
      series: [
        {
          center: ['50%', '60%'],
          name: this._name,
          type: 'gauge',
          min: this._min,
          max: this._max,
          splitNumber: 4,
          title: {
            textStyle: {
              fontSize: 12
            }
          },
          detail: {
            formatter: this._type === 'percent' ? '{value}%' : '{value}',
            textStyle: {
              fontSize: 18,
              color: 'auto'
            }
          },
          axisLabel: {
            textStyle: {
              color: 'auto'
            },
            formatter(value, index) {
              // 保留一位小数
              return value % 1 ? value.toFixed(1) : value;
            }
          },
          data: this.chartData,
          axisLine: {
            lineStyle: {
              color: this._reverse ? [[0.2, '#c23531'], [0.8, '#63869e'], [1, '#91c7ae']]
                : [[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']],
              width: 8
            }
          },
          pointer: {
            width: 5
          }
        }
      ]
    };
  }

  ngAfterViewInit() {
    this.chart = echarts.init(this.view.nativeElement);
    this.chart.setOption(this.option, true);
  }

  initOption() {
    if (this.chart) {
      this.chart.setOption(this.option, true);
    }
  }
}
