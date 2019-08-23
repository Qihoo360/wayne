import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NamespaceClient } from '../../../shared/client/v1/kubernetes/namespace';
import { CacheService } from '../../../shared/auth/cache.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AppResource } from './resource';
import * as echarts from 'echarts';
import { TranslateService } from '@ngx-translate/core';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;

@Component({
  selector: 'report-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})

export class ResourceComponent implements OnInit, AfterViewInit {
  @ViewChild('cpu', { static: false }) elementCpuView;
  @ViewChild('mem', { static: false }) elementMemView;

  resources: any;
  cpu_sum = 0;
  mem_sum = 0;
  ResourceList: AppResource[] = [];
  otherName: string;
  cpuName: string;
  memName: string;
  seriesName: string;
  dataDone = false;
  private cpuOption: EChartOption;
  private memOption: EChartOption;
  private cpuChart: ECharts;
  private memChart: ECharts;

  constructor(private namespaceClient: NamespaceClient,
              public cacheService: CacheService,
              public translate: TranslateService,
              private messageHandlerService: MessageHandlerService,
  ) {
  }

  ngOnInit() {
    this.translate.stream(['OTHER', 'TITLE.CPU_USAGE', 'TITLE.MEMORY_USAGE', 'MENU.PRODUCT']).subscribe(res => {
      this.otherName = res['OTHER'];
      this.cpuName = res['TITLE.CPU_USAGE'];
      this.memName = res['TITLE.MEMORY_USAGE'];
      this.seriesName = res['MENU.PRODUCT'];
      if (this.dataDone) {
        this.initOptions();
      }
    });
  }

  ngAfterViewInit(): void {
    const namespaceId = this.cacheService.namespaceId;
    this.cpuChart = echarts.init(this.elementCpuView.nativeElement, 'macarons');
    this.memChart = echarts.init(this.elementMemView.nativeElement, 'macarons');
    this.namespaceClient.getResource(namespaceId).subscribe(
      response => {
        this.dataDone = true;
        this.resources = response.data;
        this.ResourceList.push(...Object.keys(this.resources).map(app => {
          const rs = new AppResource();
          rs.app = app;
          rs.cpu = this.resources[app].cpu;
          rs.memory = this.resources[app].memory;
          this.cpu_sum += this.resources[app].cpu;
          this.mem_sum += this.resources[app].memory;
          return rs;
        }));
        this.initOptions();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  initOptions() {
    this.ResourceList.sort((a: AppResource, b: AppResource) => {
      return b.cpu - a.cpu;
    });

    let app = [];
    const cpu = [];
    let cnt = 0;
    for (let i = 0; i < 5 && i < this.ResourceList.length; i++) {
      app.push(this.ResourceList[i].app);
      cpu.push({value: this.ResourceList[i].cpu, name: this.ResourceList[i].app});
      cnt = cnt + this.ResourceList[i].cpu;
    }
    app.push(this.otherName);
    cpu.push({name: this.otherName, value: this.cpu_sum - cnt});
    this.cpuOption = {
      title: {
        text: this.cpuName,
        subtext: 'top 5',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} Core ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: app
      },
      series: [
        {
          name: this.seriesName,
          type: 'pie',
          radius: '55%',
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
    const mem = [];
    cnt = 0;
    for (let i = 0; i < 5 && i < this.ResourceList.length; i++) {
      app.push(this.ResourceList[i].app);
      mem.push({value: this.ResourceList[i].memory, name: this.ResourceList[i].app});
      cnt = cnt + this.ResourceList[i].memory;
    }
    app.push(this.otherName);
    mem.push({name: this.otherName, value: this.mem_sum - cnt});

    this.memOption = {
      title: {
        text: this.memName,
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
      series: [
        {
          name: this.seriesName,
          type: 'pie',
          radius: '55%',
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
    this.cpuChart.setOption(this.cpuOption);
    this.memChart.setOption(this.memOption);
  }
}
