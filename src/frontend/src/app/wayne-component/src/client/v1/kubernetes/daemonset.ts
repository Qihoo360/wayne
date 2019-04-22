import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class DaemonSetClient {
  constructor(private http: HttpClient) {
  }

  deploy(appId: number, cluster: string, resourceId: number, tplId: number, template: any): Observable<any> {
    return this.http
      .post(`/api/v1/kubernetes/apps/${appId}/daemonsets/${resourceId}/tpls/${tplId}/clusters/${cluster}`, template)
      .catch(error => throwError(error));
  }

  get(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/daemonsets/${name}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  deleteByName(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .delete(`/api/v1/kubernetes/apps/${appId}/daemonsets/${name}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }
}
