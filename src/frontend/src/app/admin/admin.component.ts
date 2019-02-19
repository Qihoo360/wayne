import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from '../shared/client/v1/breadcrumb.service';

@Component({
  selector: 'wayne-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  routeI18nMap: Object = {
    '/admin': {
      i18nKey: 'MENU.BG_HOME',
    },
    '/admin/reportform': {
      i18nKey: 'MENU.SYSTEM_STATISTICS',
      disabled: true,
    },
    '/admin/reportform/app': {
      i18nKey: 'MENU.PROJECT_REPORT',
    },
    '/admin/reportform/deploy': {
      i18nKey: 'MENU.RELEASE_STATISTICS',
    },
    '/admin/reportform/overview': {
      i18nKey: 'MENU.PLATFORM_OVERVIEW',
    },
    '/admin/config': {
      i18nKey: 'MENU.CONFIGURATION',
      disabled: true,
    },
    '/admin/config/system': {
      i18nKey: 'MENU.SYSTEM_CONFIGURATION',
    },
    '/admin/config/database': {
      i18nKey: 'MENU.DATABASE_CONFIGURATION',
    },
    '/admin/system': {
      hide: true,
    },
    '/admin/system/user': {
      i18nKey: 'MENU.USER_LIST',
    },
    '/admin/system/permission': {
      i18nKey: 'MENU.PERMISSION_LIST',
    },
    '/admin/system/group': {
      i18nKey: 'MENU.ROLE_LIST',
    },
    '/admin/apikey': {
      i18nKey: 'MENU.API_KEYS',
    },
    '/admin/cluster': {
      i18nKey: 'MENU.CLUSTER_LIST',
    },
    '/admin/cluster/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/namespace': {
      i18nKey: 'MENU.NAME_SPACE_LIST',
    },
    '/admin/namespace/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/app': {
      i18nKey: 'MENU.PRODUCT',
    },
    '/admin/app/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/deployment': {
      i18nKey: 'MENU.DEPLOYMENT_LIST',
    },
    '/admin/deployment/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/deployment/tpl': {
      i18nKey: 'MENU.TEMPLATE_LIST',
    },
    '/admin/deployment/tpl/trash': {
      i18nKey: 'MENU.TEMPLATE_RECYCLED',
    },
    '/admin/statefulset': {
      i18nKey: 'MENU.STATEFULSET_LIST',
    },
    '/admin/statefulset/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/statefulset/tpl': {
      i18nKey: 'MENU.TEMPLATE_LIST',
    },
    '/admin/statefulset/tpl/trash': {
      i18nKey: 'MENU.TEMPLATE_RECYCLED',
    },
    '/admin/daemonset': {
      i18nKey: 'MENU.DAEMONSET_LIST',
    },
    '/admin/daemonset/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/daemonset/tpl': {
      i18nKey: 'MENU.TEMPLATE_LIST',
    },
    '/admin/daemonset/tpl/trash': {
      i18nKey: 'MENU.TEMPLATE_RECYCLED',
    },
    '/admin/cronjob': {
      i18nKey: 'MENU.CRONJOB_LIST',
    },
    '/admin/cronjob/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/cronjob/tpl': {
      i18nKey: 'MENU.TEMPLATE_LIST',
    },
    '/admin/cronjob/tpl/trash': {
      i18nKey: 'MENU.TEMPLATE_RECYCLED',
    },
    '/admin/service': {
      i18nKey: 'MENU.SERVICE_LIST',
    },
    '/admin/service/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/service/tpl': {
      i18nKey: 'MENU.TEMPLATE_LIST',
    },
    '/admin/service/tpl/trash': {
      i18nKey: 'MENU.TEMPLATE_RECYCLED',
    },
    '/admin/ingress': {
      i18nKey: 'MENU.INGRESS_LIST',
    },
    '/admin/ingress/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/ingress/tpl': {
      i18nKey: 'MENU.TEMPLATE_LIST',
    },
    '/admin/ingress/tpl/trash': {
      i18nKey: 'MENU.TEMPLATE_RECYCLED',
    },
    '/admin/configmap': {
      i18nKey: 'MENU.CONFIGMAP_LIST',
    },
    '/admin/configmap/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/configmap/tpl': {
      i18nKey: 'MENU.TEMPLATE_LIST',
    },
    '/admin/configmap/tpl/trash': {
      i18nKey: 'MENU.TEMPLATE_RECYCLED',
    },
    '/admin/secret': {
      i18nKey: 'MENU.SECRET_LIST',
    },
    '/admin/secret/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/secret/tpl': {
      i18nKey: 'MENU.TEMPLATE_LIST',
    },
    '/admin/secret/tpl/trash': {
      i18nKey: 'MENU.TEMPLATE_RECYCLED',
    },
    '/admin/persistentvolumeclaim': {
      i18nKey: 'MENU.PVC_LIST',
    },
    '/admin/persistentvolumeclaim/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/persistentvolumeclaim/tpl': {
      i18nKey: 'MENU.TEMPLATE_LIST',
    },
    '/admin/persistentvolumeclaim/tpl/trash': {
      i18nKey: 'MENU.TEMPLATE_RECYCLED',
    },
    '/admin/hpa': {
      i18nKey: 'MENU.HPA_LIST',
    },
    '/admin/hpa/trash': {
      i18nKey: 'MENU.RECYCLED',
    },
    '/admin/hpa/tpl': {
      i18nKey: 'MENU.TEMPLATE_LIST',
    },
    '/admin/hpa/tpl/trash': {
      i18nKey: 'MENU.TEMPLATE_RECYCLED',
    },
    '/admin/notification': {
      i18nKey: 'MENU.NOTIFICATION',
    },
    '/admin/auditlog': {
      i18nKey: 'MENU.AUDIT_LOD',
    },
    '/admin/kubernetes': {
      i18nKey: 'MENU.K8S',
      disabled: true,
    },
    '/admin/kubernetes/dashboard': {
      i18nKey: 'MENU.DASHBOARD',
    },
    '/admin/kubernetes/node': {
      i18nKey: 'MENU.NODE',
    },
    '/admin/kubernetes/persistentvolume': {
      i18nKey: 'MENU.PV',
    },
    '/admin/kubernetes/deployment': {
      i18nKey: 'MENU.DEPLOYMENT',
    },
  };

  constructor(
    private translateService: TranslateService,
    private breadcrumbService: BreadcrumbService) {
  }

  ngOnInit() {
    const allI18nKeys = Object.keys(this.routeI18nMap)
      .reduce((arr, current) => {
        const i18nKey = this.routeI18nMap[current].i18nKey;
        if (i18nKey) {
          arr.push(i18nKey);
        }
        return arr;
      }, []);

    this.translateService.get(allI18nKeys)
      .subscribe(res => {
        Object.keys(this.routeI18nMap).forEach(path => {
          const val = this.routeI18nMap[path];
          if (val.hide) {
            this.breadcrumbService.hideRoute(path);
          } else {
            this.breadcrumbService.addFriendlyNameForRoute(path, res[val.i18nKey], !val.disabled);
          }
        });
      });
  }
}
