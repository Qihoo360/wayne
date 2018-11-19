import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../../shared/client/v1/breadcrumb.service';
import {AppService} from '../../../shared/client/v1/app.service';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {UserService} from '../../../shared/client/v1/user.service';
import {PodClient} from '../../../shared/client/v1/kubernetes/pod';
import {NodeClient} from '../../../shared/client/v1/kubernetes/node';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

@Component({
  selector: 'wayne-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['overview.scss']
})
export class OverviewComponent implements OnInit {

  appTotal: number;
  userTotal: number;
  nodeTotal: number;
  podTotal: number;

  constructor(private breadcrumbService: BreadcrumbService,
              private messageHandlerService: MessageHandlerService,
              private appService: AppService,
              private router: Router,
              private userService: UserService,
              private podClient: PodClient,
              private nodeClient: NodeClient) {
    breadcrumbService.addFriendlyNameForRoute('/admin/reportform', '系统报表', false);
    breadcrumbService.addFriendlyNameForRoute('/admin/reportform/overview', '平台概览');
  }


  ngOnInit() {
    Observable.combineLatest(
      this.appService.getStatistics(),
      this.userService.getStatistics(),
      this.nodeClient.getStatistics(),
      this.podClient.getStatistics()
    ).subscribe(
      response => {
        this.appTotal = response[0].data.total;
        this.userTotal = response[1].data.total;
        this.nodeTotal = response[2].data.total;
        this.podTotal = response[3].data.total;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  goToLink(url: string) {
    this.router.navigateByUrl(url)
  }

  ngOnDestroy(): void {
  }


}
