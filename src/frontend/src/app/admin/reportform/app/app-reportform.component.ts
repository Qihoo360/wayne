import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { AppService } from '../../../shared/client/v1/app.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;

@Component({
  selector: 'wayne-app-reportform',
  templateUrl: './app-reportform.component.html'
})
export class AppReportFormComponent implements OnInit, AfterViewInit {
  @ViewChild('tableToMeasure') elementView;
  options: EChartOption;
  private chart: ECharts;

  constructor(private breadcrumbService: BreadcrumbService,
              private messageHandlerService: MessageHandlerService,
              private appService: AppService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/reportform', '系统报表', false);
    breadcrumbService.addFriendlyNameForRoute('/admin/reportform/app', '项目概况');
  }

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.elementView.nativeElement, 'vintage');
    this.appService.getStatistics().subscribe(
      resp => {
        let data = resp.data;
        this.initOptions(data);
        this.chart.setOption(this.options);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );

  }

  initOptions(datas: any) {
    let data = this.getData(datas.details);
    this.options = {
      title: {
        text: '项目总数：' + (datas.total || 0),
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        // 使用回调函数
        formatter: function (name) {
          return name + ' (' + data.dataCount[name] + ')';
        },
        bottom: 20,
        data: data.legendData,

        selected: data.selected
      },
      series: [
        {
          name: '部门',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: data.seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  getData(details: any) {
    let legendData = Array();
    let seriesData = Array();
    let dataCount = {};
    let selected = {};
    for (let i = 0; i < details.length; i++) {
      let detail = details[i];
      legendData.push(detail.name);
      seriesData.push({
        name: detail.name,
        value: detail.count
      });
      dataCount[detail.name] = detail.count;
      selected[detail.name] = true;
    }
    return {
      legendData: legendData,
      seriesData: seriesData,
      selected: selected,
      dataCount: dataCount
    };
  }



  ngOnInit() {

  }

  ngOnDestroy(): void {
  }


}
