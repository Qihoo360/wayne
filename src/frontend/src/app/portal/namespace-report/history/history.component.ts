import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NamespaceClient} from '../../../shared/client/v1/kubernetes/namespace';
import {CacheService} from '../../../shared/auth/cache.service';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {AppService} from '../../../shared/client/v1/app.service';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;
import * as echarts from 'echarts';
import {Router} from '@angular/router';
import {
  KubeApiTypeConfigMap,
  KubeApiTypeCronJob,
  KubeApiTypeDaemonSet,
  KubeApiTypeDeployment,
  KubeApiTypePersistentVolumeClaim,
  KubeApiTypeSecret,
  KubeApiTypeService,
  KubeApiTypeStatefulSet
} from '../../../shared/shared.const';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'report-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('basic') elementBasicView;
  private basicOption: EChartOption;
  private basicChart: ECharts;
  text: string;
  subText: string;
  dataDone: boolean;
  historys: any;
  constructor(private namespaceClient: NamespaceClient,
              private router: Router,
              private appService: AppService,
              public cacheService: CacheService,
              private messageHandlerService: MessageHandlerService,
              public translate: TranslateService
  ) { }
  ngOnInit() {
    this.translate.stream(['TITLE.DEPLOY_FREQ', 'TITLE.LATE_DAY'], {value: 90}).subscribe(
      res => {
        this.text = res['TITLE.DEPLOY_FREQ'];
        this.subText = res['TITLE.LATE_DAY'];
        if (this.dataDone) this.initHistoryOptions();
      }
    );
  }

  ngAfterViewInit(): void {
    let namespaceId = this.cacheService.namespaceId;
    this.basicChart = echarts.init(this.elementBasicView.nativeElement, 'macarons');
    this.namespaceClient.getHistory(namespaceId).subscribe(
      response => {
        this.historys = response.data;
        this.initHistoryOptions();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }


  initHistoryOptions() {
    const _this = this;
    let data = [];
    for( let key in this.historys) {
      data.push({value: [ this.historys[key].date, this.historys[key].count]});
    }
    this.basicOption = <EChartOption>{
      title: {
        left: 'center',
        text: this.text,
        subtext: this.subText
      },
      tooltip : {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          return new Date(params.value[0]).toLocaleDateString([_this.translate.currentLang], { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' }) + '<br> Freq： ' + params.value[1];
        },
        axisPointer: {
          type : 'shadow',
          label: {
            show: true
          }
        }
      },
      xAxis: {
        type: 'time',
      },
      yAxis: {
        axisLine: {
          show: true
        },
        axisTick: {
          show: true
        },
      },
      visualMap: [{
        top: 10,
        right: 10,
        color: ['#d88273', '#f6efa6', '#4ad2ff']
      }],
      series: [{
        data: data,
        type: 'bar',
        barWidth: '40%',
        barMaxWidth: 20,
      }]
    };
    this.basicChart.setOption(this.basicOption);
  }
}
