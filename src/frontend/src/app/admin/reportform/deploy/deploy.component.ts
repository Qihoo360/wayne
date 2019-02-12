import { Component, OnInit } from '@angular/core';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { PublishService } from '../../../shared/client/v1/publish.service';
import { ClrDatagridStateInterface } from '@clr/angular';
import * as moment from 'moment';

@Component({
  selector: 'wayne-deploy',
  templateUrl: './deploy.component.html'
})
export class DeployComponent implements OnInit {
  datas: any;
  startTime: string;
  endTime: string;

  constructor(
    private messageHandlerService: MessageHandlerService,
    private publishService: PublishService) {
  }


  ngOnInit() {
    const now = new Date();
    this.startTime = moment(new Date(now.getTime() - 1000 * 3600 * 24 * 7)).format('MM/DD/YYYY');
    this.endTime = moment(now).format('MM/DD/YYYY');

  }

  search() {
    this.refresh();
  }

  refresh(state?: ClrDatagridStateInterface) {
    this.publishService.getDeployStatistics(
      moment(this.startTime).format('YYYY-MM-DDTHH:mm:SS') + 'Z', moment(this.endTime).format('YYYY-MM-DDTHH:mm:SS') + 'Z').
    subscribe(
      resp => {
        this.datas = resp.data;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

}
