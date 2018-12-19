import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cluster } from '../../../shared/model/v1/cluster';
import { DomSanitizer, EventManager } from '@angular/platform-browser';

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'wayne-kubernetes-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class KubernetesDashboardComponent implements OnInit {

  cluster: string;
  clusters: Array<any>;
  kubernetesDashboardUri: string;
  eventList: any[] = new Array();

  constructor(private clusterService: ClusterService,
              private route: ActivatedRoute,
              private router: Router,
              private messageHandlerService: MessageHandlerService,
              private eventManager: EventManager
  ) {
  }

  ngOnInit() {
    this.cluster = this.route.snapshot.params['cluster'];
    this.clusterService.getNames().subscribe(
      resp => {
        const data = resp.data;
        if (data) {
          this.clusters = data.map(item => item.name);
          if (data.length > 0 && !this.cluster || this.clusters.indexOf(this.cluster) === -1) {
            const cluster = data[0];
            this.jumpTo(cluster.name);
          } else {
            this.iframeJump(this.cluster);
          }
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  iframeJump(cluster: string) {
    this.clusterService.getByName(cluster).subscribe(
      resp => {
        const data: Cluster = resp.data;
        const metaData = JSON.parse(data.metaData);
        if (metaData.kubernetesDashboard) {
          this.kubernetesDashboardUri = metaData.kubernetesDashboard;
        } else {
          this.kubernetesDashboardUri = '';
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  jumpTo(cluster: string) {
    this.cluster = cluster;
    this.router.navigateByUrl(`admin/kubernetes/dashboard/${cluster}`);
    this.iframeJump(cluster);
  }


}
