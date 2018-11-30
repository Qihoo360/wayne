import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { State } from '@clr/angular';
import { ListAppComponent } from './list-app/list-app.component';
import { CreateEditAppComponent } from './create-edit-app/create-edit-app.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { App } from '../../shared/model/v1/app';
import { AppService } from '../../shared/client/v1/app.service';
import { Namespace } from '../../shared/model/v1/namespace';
import { CacheService } from '../../shared/auth/cache.service';
import { AuthService } from '../../shared/auth/auth.service';
import { PageState } from '../../shared/page/page-state';
import { ActivatedRoute } from '@angular/router';
import { NamespaceClient } from '../../shared/client/v1/kubernetes/namespace';
import { StorageService } from '../../shared/client/v1/storage.service';
import { RedDot } from '../../shared/model/v1/red-dot';
import { DOCUMENT, EventManager } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';

class ClusterCard {
  name: string;
  state: boolean;
}

const showState = {
  '名称': {hidden: false},
  '描述': {hidden: false},
  '创建时间': {hidden: false},
  '创建者': {hidden: false},
  '操作': {hidden: false}
};

@Component({
  selector: 'wayne-app',
  host: {
    'class': 'content-container'
  },
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('cardState', [
      transition('void => *', [
        style({opacity: 0, transform: 'translateY(-50%)'}),
        animate(200, style({opacity: 1, transform: 'translateY(0)'}))
      ]),
      transition('* => void', [
        animate(200, style({opacity: 0, transform: 'translateY(-50%)'}))
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ListAppComponent)
  listApp: ListAppComponent;
  @ViewChild(CreateEditAppComponent)
  createEditApp: CreateEditAppComponent;
  changedApps: App[];
  namespaces: Namespace[];
  starredFilter: boolean;
  // starredInherit 用来传递给list
  starredInherit: boolean;
  appName: string;
  pageState: PageState = new PageState();
  redDot: RedDot = new RedDot();
  subscription: Subscription;
  resources: object = new Object();
  clusters: ClusterCard[] = [];
  allowNumber: number = 10;
  allowShowAll: boolean = false;
  showList: any[] = new Array();
  showState: object = showState;
  eventList: any[] = new Array();

  constructor(private appService: AppService,
              public cacheService: CacheService,
              private route: ActivatedRoute,
              private namespaceClient: NamespaceClient,
              public authService: AuthService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private element: ElementRef,
              private storage: StorageService,
              private eventManager: EventManager,
              @Inject(DOCUMENT) private document: any) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.APP) {
        let appId = message.data;
        this.appService.deleteById(appId, this.cacheService.namespaceId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('项目删除成功！');
              this.retrieve();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  confirmEvent() {
    Object.keys(this.showState).forEach(key => {
      if (this.showList.indexOf(key) > -1) {
        this.showState[key] = {hidden: false};
      } else {
        this.showState[key] = {hidden: true};
      }
    });
  }

  cancelEvent() {
    this.initShow();
  }

  getClusterMaxNumber() {
    return Math.floor(this.element.nativeElement.querySelector('.cluster-outline').offsetWidth / 255);
  }

  boxResize(slow?: boolean) {
    if (this.allowShowAll) return;
    const length = this.clusters.length;
    setTimeout(() => {
      this.allowNumber = this.getClusterMaxNumber();
      for (var i = length; i > 0; i--) {
        if (i < this.allowNumber) {
          this.clusters[i - 1].state = true;
        } else {
          this.clusters[i - 1].state = false;
        }
      }
    }, slow ? 200 : 1000 / 60);
  }

  ngOnInit() {
    this.initShow();
    this.starredFilter = (localStorage.getItem('starred') === 'true');
    this.starredInherit = this.starredFilter;
    this.initResourceUsage();
  }

  ngAfterViewInit() {
    this.eventList.push(
      this.eventManager.addGlobalEventListener('window', 'resize', this.boxResize.bind(this)),
      this.eventManager.addEventListener(this.document.querySelector('.nav-trigger'), 'click', this.boxResize.bind(this, true))
    );
  }

  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) this.showList.push(key);
    });
  }

  dealLimitLogic(value: number): number {
    return value === 0 ? Infinity : value;
  }

  initResourceUsage() {
    this.namespaceClient.getResourceUsage(this.cacheService.namespaceId).subscribe(
      response => {
        this.resources = response.data;
        Object.getOwnPropertyNames(this.resources).forEach(cluster => {
          this.clusters.push({name: cluster, state: false});
        });
        this.allowNumber = this.getClusterMaxNumber();
        for (var i = 0; i < this.allowNumber - 1; i++) {
          setTimeout(((i) => {
            if (this.clusters[i]) {
              this.clusters[i].state = true;
            }
          }).bind(this, i), 200 * i);
        }
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  changeCard() {
    let svg = this.element.nativeElement.querySelector('.card-change-svg');
    let count = 0;
    if (this.allowShowAll) {
      this.allowShowAll = false;
      const length = this.clusters.length;
      for (var i = length; i > 0; i--) {
        if (i >= this.allowNumber) {
          setTimeout(((i) => {
            this.clusters[i - 1].state = false;
          }).bind(this, i), 200 * count++);
        }
      }
      svg.style.transform = 'rotateZ(0)';
    } else {
      this.allowShowAll = true;
      this.clusters.forEach(item => {
        if (!item.state) {
          setTimeout(((item) => {
            item.state = true;
          }).bind(this, item), 200 * count++);
        }
      });
      svg.style.transform = 'rotateZ(90deg)';
    }
  }

  // 处理回车事件也可以搜索
  keyDownFunction(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      this.searchApp();
    }
  }

  searchApp() {
    this.retrieve();
  }

  starredChange(starred) {
    this.starredFilter = starred;
    localStorage.setItem('starred', this.starredFilter.toString());
    this.retrieve();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.eventList.forEach(item => {
      item();
    });
  }

  retrieve(state?: State): void {
    if (!this.cacheService.currentNamespace) {
      return;
    }
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    let namespaceId = this.cacheService.namespaceId;
    this.pageState.params['name'] = this.appName;
    this.pageState.params['deleted'] = false;
    this.pageState.params['namespace'] = namespaceId;
    this.pageState.params['starred'] = this.starredFilter + '';
    if (this.pageState.sort) {
      this.pageState.sort.by = 'id';
      this.pageState.sort.reverse = true;
    }
    this.appService.listPage(this.pageState, namespaceId.toString())
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedApps = data.list;
          this.starredInherit = this.starredFilter;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createApp(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEditApp.newOrEditApp();
  }

  deleteApp(app: App) {
    let deletionMessage = new ConfirmationMessage(
      '删除项目确认',
      '你确认删除项目 ' + app.name + ' ？',
      app.id,
      ConfirmationTargets.APP,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editApp(app: App) {
    this.createEditApp.newOrEditApp(app.id);
  }
}
