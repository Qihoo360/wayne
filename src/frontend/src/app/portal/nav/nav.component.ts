import { Component, OnDestroy, OnInit } from '@angular/core';
import { Namespace } from '../../shared/model/v1/namespace';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { CacheService } from '../../shared/auth/cache.service';
import { AuthoriseService } from '../../shared/client/v1/auth.service';
import { NotificationService } from '../../shared/client/v1/notification.service';
import { Notification, NotificationLog } from '../../shared/model/v1/notification';
import { PageState } from '../../shared/page/page-state';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { LoginTokenKey } from '../../shared/shared.const';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../shared/client/v1/storage.service';

@Component({
  selector: 'wayne-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  namespace: Namespace;
  notificationLogs: NotificationLog[];
  notification: Notification = new Notification();
  notificationModal = false;
  pageState: PageState = new PageState();
  mind = false;
  currentLang: string;


  constructor(private router: Router,
              private authoriseService: AuthoriseService,
              private route: ActivatedRoute,
              public cacheService: CacheService,
              private notificationService: NotificationService,
              private messageHandlerService: MessageHandlerService,
              public translate: TranslateService,
              private storage: StorageService,
              public authService: AuthService) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
    });
    this.namespace = this.cacheService.currentNamespace;
    const nid = this.route.snapshot.params['nid'];
    if (this.cacheService.currentNamespace && parseInt(nid, 10) !== this.cacheService.namespaceId) {
      this.hackNavigateReload(`/portal/namespace/${this.cacheService.namespaceId}/app`);
    } else {
      this.authService.setNamespacePermissionById(nid);
    }
    this.pullNotification();
  }

  getTitle() {
    const imagePrefix = this.authService.config['system.title'];
    return imagePrefix ? imagePrefix : 'Wayne';
  }

  switchNamespace(namespace: Namespace) {
    this.namespace = namespace;
    this.cacheService.setNamespace(namespace);
    this.hackNavigateReload(`/portal/namespace/${namespace.id}/app`);
  }

  hackNavigateReload(url: string) {
    const refreshUrl = url.indexOf('someRoute') > -1 ? '/someOtherRoute' : '/someRoute';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(url));
  }

  goBack() {
    if (window) {
      window.location.href = '/admin/reportform/overview';
    }
  }

  showLang(lang: string): string {
    switch (lang) {
      case 'en':
        return 'English';
      case 'zh-Hans':
        return '中文简体';
      default:
        return '';
    }
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.storage.save('lang', lang);
  }

  logout() {
    localStorage.removeItem(LoginTokenKey);
    this.router.navigateByUrl('/sign-in');
  }

  pullNotification() {
    this.notificationService.subscribe(this.pageState).subscribe(
      response => {
        this.notificationLogs = response.data;
        this.mind = false;
        for (const n of this.notificationLogs) {
          this.mind = this.mind || !n.is_readed;
        }
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  showNotification(notificationlog: NotificationLog) {
    this.notification = notificationlog.notification;
    this.notificationModal = true;
    this.notificationService.read(notificationlog.id).subscribe(
      response => {
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  closeNotification() {
    this.notificationModal = false;
    this.pullNotification();
  }

}
