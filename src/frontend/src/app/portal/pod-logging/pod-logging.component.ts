import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ContainerStatus, Pod} from '../../shared/model/v1/kubernetes/pod';
import {MessageHandlerService} from '../../shared/message-handler/message-handler.service';
import {PodClient} from '../../shared/client/v1/kubernetes/pod';
import {LogClient} from '../../shared/client/v1/kubernetes/log';
import {ClusterService} from '../../shared/client/v1/cluster.service';
import {Cluster} from '../../shared/model/v1/cluster';
import {CopyService} from '../../shared/client/v1/copy.service';

@Component({
  selector: 'pod-logging',
  templateUrl: 'pod-logging.component.html',
  styleUrls: ['pod-logging.component.scss']
})
export class PodLoggingComponent implements OnInit, OnDestroy {
  appId: number;
  cluster: string;
  nid: string;
  namespace: string;
  selectedPod: Pod = new Pod();
  selectedContainer: string;
  containers: ContainerStatus[];
  log: string;
  logTails: number = 10;
  resourceName: string;
  resourceType: string;
  pods: Pod[];
  logSource: string;
  isCopied: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private logClient: LogClient,
              private messageHandlerService: MessageHandlerService,
              private podClient: PodClient,
              private clusterService: ClusterService,
              private copyService: CopyService
            ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }

  ngOnInit(): void {
    this.appId = parseInt(this.route.snapshot.params['id']);
    this.cluster = this.route.snapshot.params['cluster'];
    this.namespace = this.route.snapshot.params['namespace'];
    let podName = this.route.snapshot.params['podName'];
    let container = this.route.snapshot.params['container'];
    this.nid = this.route.snapshot.params['nid'];
    this.resourceName = this.route.snapshot.params['resourceName'];
    this.resourceType = this.route.snapshot.params['resourceType'];
    this.clusterService.getByName(this.cluster).subscribe(
      response => {
        let cluster: Cluster = response.data;
        if (cluster.metaData) {
          let metaData = JSON.parse(cluster.metaData);
          if (metaData.logSource) {
            this.logSource = metaData.logSource;
          }
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
    this.podClient.listByResouce(this.appId, this.cluster, this.namespace, this.resourceType, this.resourceName).subscribe(
      response => {
        this.pods = response.data;
        if (this.pods && this.pods.length > 0) {
          let pod = this.getPodByName(podName);
          if (!pod) {
            let url = `portal/logging/namespace/${this.nid}/app/${this.appId}/${this.resourceType}/${this.resourceName}/pod/${this.pods[0].name}/${this.cluster}/${this.namespace}`;
            this.router.navigateByUrl(url);
          }
          this.selectedPod = pod;
          this.initContainer(container);
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  copyLogCommand() {
    if (this.logSource === undefined) {
      this.messageHandlerService.showInfo('缺少机房信息，请联系管理员');
    }
    const command = this.selectedPod ? `kubetool log --source ${this.logSource === undefined ? '' : this.logSource} --${this.resourceType} ${this.resourceName} --pod=${this.selectedPod.name} --container=${this.selectedContainer}  --layout=log` : '';
    this.copyService.copy(command);
    this.switchCopyButton();
  }

  switchCopyButton() {
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 3000);
  }

  initContainer(container: string) {
    this.containers = this.selectedPod.containerStatus;
    for (let con of this.containers) {
      if (container == con.name) {
        this.selectedContainer = container;
        this.containerChange();
        return;
      }
    }
    this.selectedContainer = this.containers[0].name;
    this.containerChange();
  }

  get prettyLog() {
    if (this.log) {
      return this.log.toString().replace(/(\\r\\n)|([\r\n])/gmi, '<br>')
    }
  }

  containerChange() {
    let url = `portal/logging/namespace/${this.nid}/app/${this.appId}/${this.resourceType}/${this.resourceName}/pod/${this.selectedPod.name}/container/${this.selectedContainer}/${this.cluster}/${this.namespace}`;
    this.router.navigateByUrl(url);
    this.refreshLog();
  }

  refreshLog(){
    this.logClient.get(this.appId, this.cluster, this.namespace, this.selectedPod.name, this.selectedContainer, this.logTails).subscribe(
      response => {
        this.log = response.data
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }


  getPodByName(podName: string) {
    if (podName) {
      for (let pod of this.pods) {
        if (pod.name == podName) {
          return pod;
        }
      }
    }
    return null;
  }


  podChange() {
    this.containers = this.selectedPod.containerStatus;
    if (this.containers&&this.containers.length>0){
      this.selectedContainer = this.containers[0].name;
      let url = `portal/logging/namespace/${this.nid}/app/${this.appId}/${this.resourceType}/${this.resourceName}/pod/${this.selectedPod.name}/container/${this.selectedContainer}/${this.cluster}/${this.namespace}`;
      this.router.navigateByUrl(url);
    }
  }

  ngOnDestroy(): void {
  }
}
