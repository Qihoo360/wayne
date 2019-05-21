// Kubernetes common client
// for all kubernetes resource proxy
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { KubeResourcesName } from '../../../shared.const';
import { PageState } from '../../../page/page-state';
import { BaseClient } from './base-client';
import { throwError } from 'rxjs';

@Injectable()
export class KubernetesClient {
  constructor(private http: HttpClient) {
  }

  get(cluster: string, kind: KubeResourcesName, name: string, namespace?: string, appId?: string): Observable<any> {
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }

    let link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/${kind}/${name}`;
    if (namespace) {
      link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}/${name}`;
    }

    return this.http
      .get(link)
      .catch(error => throwError(error));
  }

  getNames(cluster: string, kind: KubeResourcesName, namespace?: string, appId?: string): Observable<any> {
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }
    let link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/${kind}/names`;
    if (namespace) {
      link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}/names`;
    }
    return this.http
      .get(link)
      .catch(error => throwError(error));
  }

  listPage(pageState: PageState, cluster: string, kind: KubeResourcesName, namespace?: string, appId?: string): Observable<any> {
    const params = BaseClient.buildParam(pageState);
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }

    let link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/${kind}`;
    if (namespace) {
      link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}`;
    }

    return this.http
      .get(link, {params: params})
      .catch(error => throwError(error));
  }

  create(obj: any, cluster: string, kind: KubeResourcesName, namespace?: string, appId?: string): Observable<any> {
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }

    let link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/${kind}`;
    if (namespace) {
      link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}`;
    }

    return this.http
      .post(link, obj)
      .catch(error => throwError(error));
  }

  update(obj: any, cluster: string, kind: KubeResourcesName, name: string, namespace?: string, appId?: string): Observable<any> {
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }

    let link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/${kind}/${name}`;
    if (namespace) {
      link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}/${name}`;
    }

    return this.http
      .put(link, obj)
      .catch(error => throwError(error));
  }

  // force delete will delete obj for etcd directly
  delete(cluster: string, kind: KubeResourcesName, force: boolean, name: string, namespace?: string, appId?: string): Observable<any> {
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }

    let link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/${kind}/${name}`;
    if (namespace) {
      link = `/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}/${name}`;
    }

    if (force === true) {
      link = `${link}?force=${force}`;
    }

    return this.http
      .delete(link)
      .catch(error => throwError(error));
  }

}
