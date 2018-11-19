import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../../shared/client/v1/breadcrumb.service';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {PublishService} from '../../../shared/client/v1/publish.service';
import {State} from '@clr/angular';

@Component({
  selector: 'wayne-deploy',
  templateUrl: './deploy.component.html'
})
export class DeployComponent implements OnInit {
  datas: any;
  startTime: string;
  endTime: string;

  constructor(private breadcrumbService: BreadcrumbService,
              private messageHandlerService: MessageHandlerService,
              private publishService: PublishService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/reportform', '系统报表', false);
    breadcrumbService.addFriendlyNameForRoute('/admin/reportform/deploy', '上线次数统计');
  }


  ngOnInit() {
    const now = new Date();
    this.startTime = this.formatDate(new Date(now.getTime() - 1000 * 3600 * 24 * 7));
    this.endTime = this.formatDate(now);
  }

  formatDate(time: Date) {
    const year: number = time.getFullYear();
    const month: any = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
    const day: any = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    return year + '-' + month + '-' + day;
  };


  search() {
    this.refresh();
  }

  ngOnDestroy(): void {
  }

  refresh(state?: State) {
    this.publishService.getDeployStatistics(this.startTime + 'T00:00:00Z', this.endTime + 'T00:00:00Z').subscribe(
      resp => {
        this.datas = resp.data;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

}
