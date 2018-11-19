import {Component, OnDestroy, OnInit} from '@angular/core';
import {Namespace} from '../../shared/model/v1/namespace';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../shared/auth/auth.service';
import {CacheService} from '../../shared/auth/cache.service';
import {AuthoriseService} from '../../shared/client/v1/auth.service';
import {NotificationService} from '../../shared/client/v1/notification.service';
import {Notification, NotificationLog} from '../../shared/model/v1/notification';
import {PageState} from '../../shared/page/page-state';
import {MessageHandlerService} from '../../shared/message-handler/message-handler.service';
import {LoginTokenKey} from '../../shared/shared.const';

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


  constructor(private router: Router,
              private authoriseService: AuthoriseService,
              private route: ActivatedRoute,
              public cacheService: CacheService,
              private notificationService: NotificationService,
              private messageHandlerService: MessageHandlerService,
              public authService: AuthService) {
    // override the route reuse strategy
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // }
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.namespace = this.cacheService.currentNamespace;
    let nid = this.route.snapshot.params['nid'];
    if (this.cacheService.currentNamespace && nid != this.cacheService.namespaceId) {
      this.hackNavigateReload(`/portal/namespace/${this.cacheService.namespaceId}/app`);
    } else {
      this.authService.setNamespacePermissionById(nid);
    }
    this.pullNotification();
  }

  getTitle() {
    let imagePrefix = this.authService.config['system.title'];
    return imagePrefix ? imagePrefix : 'Wayne';
  }

  switchNamespace(namespace: Namespace) {
    this.namespace = namespace;
    // this.authService.setNamespacePermissionById(namespace.id);
    this.cacheService.setNamespace(namespace);
    this.hackNavigateReload(`/portal/namespace/${namespace.id}/app`);
  }

  hackNavigateReload(url: string) {
    let refreshUrl = url.indexOf('someRoute') > -1 ? '/someOtherRoute' : '/someRoute';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(url));
  }

  goBack() {
    if (window) window.location.href = '/admin/reportform/overview';
  }

  logout() {
    localStorage.removeItem(LoginTokenKey);
    this.router.navigateByUrl('/sign-in')
  }

  pullNotification() {
    this.notificationService.subscribe(this.pageState).subscribe(
      response => {
        this.notificationLogs = response.data;
        this.mind = false
        for (let n of this.notificationLogs) {
          this.mind = this.mind || !n.is_readed
        }
      },
      error => this.messageHandlerService.handleError(error)
    )
  }

  showNotification(notificationlog: NotificationLog) {
    this.notification = notificationlog.notification;
    this.notificationModal = true;
    this.notificationService.read(notificationlog.id).subscribe(
      response => {
      },
      error => this.messageHandlerService.handleError(error)

    )
  }

  closeNotification() {
    this.notificationModal = false;
    this.pullNotification();
  }

}
