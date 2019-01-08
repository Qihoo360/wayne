import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { KubeResourcesName } from '../../../shared.const';
import { PageState } from '../../../page/page-state';
import { BaseClient } from './base-client';
import { KubeDeployment } from '../../../model/v1/kubernetes/deployment';

@Injectable()
export class KubernetesClient {
  constructor(private http: HttpClient) {
  }

  get(cluster: string, kind: KubeResourcesName, namespace: string, name: string, appId?: string): Observable<any> {
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }

    return this.http
      .get(`/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}/${name}`)
      .catch(error => Observable.throw(error));
  }

  getNames(cluster: string, kind: KubeResourcesName, namespace: string, appId?: string): Observable<any> {
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }
    return this.http
      .get(`/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}/names`)
      .catch(error => Observable.throw(error));
  }

  ListPage(pageState: PageState, cluster: string, kind: KubeResourcesName, namespace: string, appId?: string): Observable<any> {
    const params = BaseClient.buildParam(pageState);

    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }
    return this.http
      .get(`/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}`, {params: params})
      .catch(error => Observable.throw(error));
  }

  create(cluster: string, kind: KubeResourcesName, namespace: string, obj: any, appId?: string): Observable<any> {
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }
    return this.http
      .post(`/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}`, obj)
      .catch(error => Observable.throw(error));
  }

  update(cluster: string, kind: KubeResourcesName, namespace: string, name: string, obj: KubeDeployment, appId?: string): Observable<any> {
    return this.http
      .put(`/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}/${name}`, obj)
      .catch(error => Observable.throw(error));
  }

  delete(cluster: string, kind: KubeResourcesName, namespace: string, name: string, appId?: string): Observable<any> {
    return this.http
      .delete(`/api/v1/apps/${appId}/_proxy/clusters/${cluster}/namespaces/${namespace}/${kind}/${name}`)
      .catch(error => Observable.throw(error));
  }

}
