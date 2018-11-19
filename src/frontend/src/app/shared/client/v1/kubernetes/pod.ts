import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class PodClient {
  constructor(private http: HttpClient) {
  }

  list(appId: number, cluster: string, namespace: string, deployment: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('deployment', deployment);
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/pods/namespaces/${namespace}/clusters/${cluster}`, {params: params})
      .catch(error => Observable.throw(error))
  }

  listByResouce(appId: number, cluster: string, namespace: string, resouceType: string,name: string): Observable<any> {
    let params = new HttpParams();
    params = params.set(resouceType, name);
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/pods/namespaces/${namespace}/clusters/${cluster}`, {params: params})
      .catch(error => Observable.throw(error))
  }

  get(appId: number, cluster: string, namespace: string, pod: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/pods/${pod}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error))
  }

  deleteByName(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .delete(`/api/v1/kubernetes/apps/${appId}/pods/${name}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  getStatistics(): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/pods/statistics`)
      .catch(error => Observable.throw(error))
  }

  createTerminal(appId: number, cluster: string, namespace: string, pod: string, container: string, cmd?: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('container', container);
    params = params.set('cmd', cmd);
    return this.http
      .post(`/api/v1/kubernetes/apps/${appId}/pods/${pod}/terminal/namespaces/${namespace}/clusters/${cluster}`, null, {params: params})
      .catch(error => Observable.throw(error))
  }

}
