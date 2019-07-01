import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { App } from '../../../shared/model/v1/app';
import { AuthService } from '../../../shared/auth/auth.service';
import { Page } from '../../../shared/page/page-state';
import { AppStarredService } from '../../../shared/client/v1/appstarred.service';
import { AppStarred } from '../../../shared/model/v1/app-starred';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'list-app',
  templateUrl: 'list-app.component.html',
  styleUrls: ['list-app.scss']
})
export class ListAppComponent implements OnInit {
  @Input() starredFilter: boolean;
  @Input() apps: App[];
  @Input() page: Page;
  state: ClrDatagridStateInterface;
  currentPage = 1;
  @Input() showState: object;
  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<App>();
  @Output() edit = new EventEmitter<App>();


  constructor(private router: Router,
              public cacheService: CacheService,
              private appStarredService: AppStarredService,
              private messageHandlerService: MessageHandlerService,
              public authService: AuthService,
              public translate: TranslateService) {
  }

  ngOnInit(): void {
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  goToMonitor(app: App) {
    window.open(this.getMonitorUri().replace('{{app.name}}', app.name), '_blank');
  }

  getMonitorUri() {
    return this.cacheService.currentNamespace.metaDataObj['system.monitor-url']
        || this.authService.config['system.monitor-uri'];
  }

  refresh(state?: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteApp(app: App) {
    this.delete.emit(app);
  }

  editApp(app: App) {
    this.edit.emit(app);
  }

  enterApp(app: App) {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${app.id}/detail`]);
  }

  starredApp(app: App) {
    const appStarred = new AppStarred();
    appStarred.app = app;
    this.appStarredService.create(appStarred).subscribe(
      response => {
        this.messageHandlerService.showSuccess(`项目${app.name}收藏成功！`);
        this.refresh();
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  unstarredApp(app: App) {
    this.appStarredService.deleteByAppId(app.id).subscribe(
      response => {
        this.messageHandlerService.showSuccess(`项目${app.name}取消收藏成功！`);
        this.refresh();
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

}
