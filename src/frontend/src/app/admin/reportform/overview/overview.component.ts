import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AppService } from '../../../shared/client/v1/app.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { UserService } from '../../../shared/client/v1/user.service';
import { PodClient } from '../../../shared/client/v1/kubernetes/pod';
import { NodeClient } from '../../../shared/client/v1/kubernetes/node';

interface Summary {
  appTotal: number;
  userTotal: number;
  nodeTotal: number;
  podTotal: number;
}

@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['overview.scss']
})
export class OverviewComponent implements OnInit {
  summary: Summary = {
    appTotal: 0,
    userTotal: 0,
    nodeTotal: 0,
    podTotal: 0,
  };

  constructor(
    private messageHandlerService: MessageHandlerService,
    private appService: AppService,
    private router: Router,
    private userService: UserService,
    private podClient: PodClient,
    private nodeClient: NodeClient) {
  }

  ngOnInit() {
    combineLatest(
      [this.appService.getStatistics(),
      this.userService.getStatistics(),
      this.nodeClient.getStatistics(),
      this.podClient.getStatistics()]
    ).subscribe(
      ([appRes, userRes, nodeRes, PodRes]) => {
        this.summary.appTotal = appRes.data.total || 0;
        this.summary.userTotal = userRes.data.total || 0;
        this.summary.nodeTotal = nodeRes.data.total || 0;
        this.summary.podTotal = PodRes.data.total || 0;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  goToLink(url: string) {
    this.router.navigateByUrl(url);
  }

}
