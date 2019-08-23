import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Terminal } from 'xterm';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { PodClient } from '../../shared/client/v1/kubernetes/pod';
import * as SockJS from 'sockjs-client';
import { Container, KubePod } from '../../shared/model/v1/kubernetes/kubepod';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'pod-terminal',
  templateUrl: 'pod-terminal.component.html',
  styleUrls: ['pod-terminal.component.scss']
})
export class PodTerminalComponent implements OnInit, OnDestroy {
  appId: number;
  cluster: string;
  nid: string;
  namespace: string;
  selectedPod = new KubePod();
  selectedContainer: string;
  containers: Container[];
  log: string;
  resourceName: string;
  resourceType: string;
  pods: KubePod[];
  @ViewChild('terminal', { static: false })
  terminal: ElementRef;
  xterm: Terminal;
  socket: SockJS;
  private timer: any = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private messageHandlerService: MessageHandlerService,
              private podClient: PodClient) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.appId = parseInt(this.route.snapshot.params['id'], 10);
    this.cluster = this.route.snapshot.params['cluster'];
    this.namespace = this.route.snapshot.params['namespace'];
    const podName = this.route.snapshot.params['podName'];
    const container = this.route.snapshot.params['container'];
    this.nid = this.route.snapshot.params['nid'];
    this.resourceName = this.route.snapshot.params['resourceName'];
    this.resourceType = this.route.snapshot.params['resourceType'];
    const pageState = new PageState();
    pageState.page.pageSize = 1000;
    this.podClient.listPageByResouce(pageState, this.cluster, this.namespace, this.resourceType, this.resourceName, this.appId).subscribe(
      response => {
        this.pods = response.data.list;
        if (this.pods && this.pods.length > 0) {
          const pod = this.getPodByName(podName);
          if (!pod) {
            const url = `portal/namespace/${this.nid}/app/${this.appId}/${this.resourceType}` +
              `/${this.resourceName}/pod/${this.pods[0].metadata.name}/terminal/${this.cluster}/${this.namespace}`;
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

  initContainer(container: string) {
    this.containers = this.selectedPod.spec.containers;
    for (const con of this.containers) {
      if (container === con.name) {
        this.selectedContainer = container;
        this.initTernimal();
        return;
      }
    }
    this.selectedContainer = this.containers[0].name;
    this.containerChange();
  }

  containerChange() {
    const url = `portal/namespace/${this.nid}/app/${this.appId}/${this.resourceType}` +
      `/${this.resourceName}/pod/${this.selectedPod.metadata.name}/container/${this.selectedContainer}` +
      `/terminal/${this.cluster}/${this.namespace}`;
    this.router.navigateByUrl(url);
  }


  getPodByName(podName: string) {
    if (podName) {
      for (const pod of this.pods) {
        if (pod.metadata.name === podName) {
          return pod;
        }
      }
    }
    return null;
  }


  podChange() {
    this.containers = this.selectedPod.spec.containers;
    this.selectedContainer = this.containers[0].name;
    const url = `portal/namespace/${this.nid}/app/${this.appId}/${this.resourceType}/${this.resourceName}` +
      `/pod/${this.selectedPod.metadata.name}/container/${this.selectedContainer}/terminal/${this.cluster}/${this.namespace}`;
    this.router.navigateByUrl(url);
  }

  initTernimal() {
    this.xterm = new Terminal();
    this.xterm.on(
      'resize', (size) => {
        // wait for terminal initial
        this.timer = setInterval(() => {
          this.socket.send(JSON.stringify({'Op': 'stdin', 'Data': 'echo wayne-init\n'}));
        }, 1000);
      }
    );
    this.xterm.on('key', (key?: string, ev?: KeyboardEvent) => {
    });
    this.xterm.on('data', (data: any) => {
      this.socket.send(JSON.stringify({'Op': 'stdin', 'Data': data}));
    });
    this.xterm.open(this.terminal.nativeElement);
    this.connect();
  }

  connect() {
    this.podClient.createTerminal(this.appId, this.cluster, this.namespace, this.selectedPod.metadata.name, this.selectedContainer)
      .subscribe(
        response => {
          const session = response.data.sessionId;
          const configUrl = (window as any).CONFIG.URL;
          const url = `${configUrl}/ws/pods/exec?${session}`;
          this.socket = new SockJS(url);
          this.socket.onopen = this.onConnectionOpen.bind(this, response.data);
          this.socket.onmessage = this.onConnectionMessage.bind(this);
          this.socket.onclose = this.onConnectionClose.bind(this);
        },
        error => {
          this.messageHandlerService.handleError(error);
        }
      );
  }

  // 连接建立成功后的挂载操作
  onConnectionOpen(data: any): void {
    this.socket.send(JSON.stringify({'Op': 'bind', 'data': JSON.stringify(data)}));
    winptyCompat.winptyCompatInit(this.xterm);
    webLinks.webLinksInit(this.xterm);
    this.onTerminalResize();
    this.xterm.focus();
  }

  // 修改窗口大小
  onTerminalResize() {
    const width = this.terminal.nativeElement.parentElement.clientWidth;
    const height = this.terminal.nativeElement.parentElement.clientHeight;
    const xterm: any = this.xterm;
    const cols = (width - xterm._core.viewport.scrollBarWidth - 15) / xterm._core.renderer.dimensions.actualCellWidth;
    const rows = height / xterm._core.renderer.dimensions.actualCellHeight;
    this.xterm.resize(parseInt(cols.toString(), 10), parseInt(rows.toString(), 10));

  }

  // 获取服务端传来的信息
  onConnectionMessage(evt) {
    try {
      const msg = JSON.parse(evt.data);
      switch (msg['Op']) {
        case 'stdout':
          if (msg['Data'].toString().indexOf(`starting container process caused 'exec: \\'bash\\': executable file not found in $PATH'`)
            === -1) {
            if (msg['Data'].indexOf('wayne-init') > -1) {
              console.log('server ready.');
              clearInterval(this.timer);
              // when server ready for connection,send resize to server
              // send double time for bash and sh ,ensure the terminal can be resized.
              this.socket.send(JSON.stringify({'Op': 'resize', 'Cols': this.xterm.cols, 'Rows': this.xterm.rows}));
              this.socket.send(JSON.stringify({'Op': 'resize', 'Cols': this.xterm.cols, 'Rows': this.xterm.rows}));
            } else {
              this.xterm.write(msg['Data']);
            }

          }
          break;
        default:
          console.error('Unexpected message type:', msg);
      }
    } catch (e) {
      console.log('parse json error.', evt.data);
    }

  }

  // 连接关闭
  onConnectionClose(evt) {
    if (evt.reason !== '' && evt.code < 1000) {
      this.xterm.writeln(evt.reason);
    } else {
      this.xterm.writeln('Connection closed');
    }
  }

  ngOnDestroy(): void {
    if (this.xterm) {
      this.xterm.dispose();
    }
    if (this.socket) {
      this.socket.close();
    }
    clearInterval(this.timer);
  }
}
