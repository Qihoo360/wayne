import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {NamespaceClient} from '../../../shared/client/v1/kubernetes/namespace';
import {CacheService} from '../../../shared/auth/cache.service';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {AppResource } from './resource';

import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;
import * as echarts from 'echarts';

@Component({
  selector: 'report-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})

export class ResourceComponent implements OnInit, AfterViewInit {
  @ViewChild('cpu') elementCpuView;
  @ViewChild('mem') elementMemView;

  resources: any;
  cpu_sum = 0;
  mem_sum = 0;
  ResourceList: AppResource[] = [];
  private cpuOption: EChartOption;
  private memOption: EChartOption;
  private cpuChart: ECharts;
  private memChart: ECharts;
  constructor(private namespaceClient: NamespaceClient,
              public cacheService: CacheService,
              private messageHandlerService: MessageHandlerService,
  ) { }
  ngOnInit() { }

  ngAfterViewInit(): void {
    let namespaceId = this.cacheService.namespaceId;
    this.cpuChart = echarts.init(this.elementCpuView.nativeElement, 'macarons');
    this.memChart = echarts.init(this.elementMemView.nativeElement, 'macarons');
    this.namespaceClient.getResource(namespaceId).subscribe(
      response => {
        this.resources = response.data;
        this.ResourceList.push(...Object.keys(this.resources).map(app => {
            let rs = new AppResource();
            rs.app = app;
            rs.cpu = this.resources[app].cpu;
            rs.memory = this.resources[app].memory;
            this.cpu_sum += this.resources[app].cpu;
            this.mem_sum += this.resources[app].memory;
            return rs;
          }));
        this.initOptions();
        this.cpuChart.setOption(this.cpuOption);
        this.memChart.setOption(this.memOption);
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  initOptions() {
    this.ResourceList.sort((a: AppResource, b: AppResource) => {
      return b.cpu - a.cpu;
    });

    let app = [];
    let cpu = [];
    let cnt = 0;
    for (let i = 0; i < 5 && i < this.ResourceList.length; i++) {
      app.push(this.ResourceList[i].app);
      cpu.push({value: this.ResourceList[i].cpu, name: this.ResourceList[i].app});
      cnt = cnt + this.ResourceList[i].cpu;
    }
    app.push('其他');
    cpu.push({name: '其他', value: this.cpu_sum - cnt});
    this.cpuOption = {
      title : {
        text: 'CPU 用量审计',
        subtext: 'top 5',
        left: 'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} 核 ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: app
      },
      series : [
        {
          name: '项目',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data: cpu,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      color: ['#4885ed', '#db3236', '#f4c20d', '#3cba54', '#4ad2ff', '#f6efa6']
    };

    this.ResourceList.sort(function sortNumber(a, b) {
      return b.memory - a.memory;
    });
    app = [];
    let mem = [];
    cnt = 0;
    for (let i = 0; i < 5 && i < this.ResourceList.length; i++) {
      app.push(this.ResourceList[i].app);
      mem.push({value: this.ResourceList[i].memory, name: this.ResourceList[i].app});
      cnt = cnt + this.ResourceList[i].memory;
    }
    app.push('其他');
    mem.push({name: '其他', value: this.mem_sum - cnt});

    this.memOption = {
      title : {
        text: '内存用量审计',
        subtext: 'top 5',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} G ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: app
      },
      series : [
        {
          name: '项目',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data: mem,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      color: ['#4885ed', '#db3236', '#f4c20d', '#3cba54', '#4ad2ff', '#f6efa6']
    };
  }
}
