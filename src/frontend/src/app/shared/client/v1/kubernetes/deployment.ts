import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { PageState } from '../../../page/page-state';
import { BaseClient } from './base-client';
import { KubeDeployment, ObjectMeta } from '../../../model/v1/kubernetes/deployment';

@Injectable()
export class DeploymentClient {
  constructor(private http: HttpClient) {
  }

  listPage(pageState: PageState, cluster: string, namespace: string, appId?: string): Observable<any> {
    const params = BaseClient.buildParam(pageState);
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }

    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/deployments/namespaces/${namespace}/clusters/${cluster}`, {params: params})
      .catch(error => Observable.throw(error));
  }

  deploy(appId: number, cluster: string, resourceId: number, tplId: number, template: any): Observable<any> {
    return this.http
      .post(`/api/v1/kubernetes/apps/${appId}/deployments/${resourceId}/tpls/${tplId}/clusters/${cluster}`, template)
      .catch(error => Observable.throw(error));
  }

  getDetail(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/deployments/${name}/detail/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  get(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/deployments/${name}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  update(appId: number, cluster: string, namespace: string, name: string, obj: KubeDeployment): Observable<any> {
    return this.http
      .put(`/api/v1/kubernetes/apps/${appId}/deployments/${name}/namespaces/${namespace}/clusters/${cluster}`, obj)
      .catch(error => Observable.throw(error));
  }

  deleteByName(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .delete(`/api/v1/kubernetes/apps/${appId}/deployments/${name}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }
}
