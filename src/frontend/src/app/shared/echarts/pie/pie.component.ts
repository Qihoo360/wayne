import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import * as echarts from 'echarts';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;
import { Data } from './pie';

@Component({
  selector: 'echarts-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class EchartsPieComponent implements AfterViewInit {
  @ViewChild('view') view;
  chart: ECharts;
  _title: string;
  _data: Data[];
  @Input('title')
  set title(value) {
    this._title = value;
    this.initOption();
  }
  @Input('data')
  set data(value: Data[]) {
    this._data = value;
    this.initOption();
  }
  get option() {
    const option = {
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
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      toolbox: {
        show: true,
        feature: {
        }
      },
      calculable: false,
      series: [
        {
          center: ['50%', '60%'],
          name: '访问来源',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, 55],
          itemStyle: {
            normal: {
              label: {
                position: 'inner'
              },
              labelLine: {
                show: false
              }
            }
          },
          data: [
            { value: 4, name: 'Ready' },
            { value: 1, name: '其他' }
          ]
        },
        {
          center: ['50%', '60%'],
          name: '访问来源',
          type: 'pie',
          radius: [70, 90],
          data: [
            { value: 3, name: '可调度' },
            { value: 2, name: '其他' }
          ]
        }
      ]
    };
    option.series = this._data.map((item, index) => {
      return {
        center: ['50%', '60%'],
        name: item.title,
        type: 'pie',
        selectedMode: 'single',
        radius: index ? [55 + 15 * index, 75 + 15 * index] : [0, 55],
        itemStyle: {
          normal: {
            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            }
          }
        },
        data: item.data
      };
    });
    return option;
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
