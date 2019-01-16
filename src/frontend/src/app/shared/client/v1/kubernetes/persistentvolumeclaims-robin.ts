import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PersistentVolumeClaimRobinClient {
  constructor(private http: HttpClient) {
  }

  getStatus(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims/robin/${name}/status/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  activeRbdImage(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .post(`/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims/robin/${name}/rbd/namespaces/${namespace}/clusters/${cluster}`, null)
      .catch(error => Observable.throw(error));
  }

  inActiveRbdImage(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .delete(`/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims/robin/${name}/rbd/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  offlineRbdImageUser(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .delete(`/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims/robin/${name}/user/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  loginInfo(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims/robin/${name}/user/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  verify(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims/robin/${name}/verify/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  listSnapshot(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims/robin/${name}/snapshot/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  createSnapshot(appId: number, cluster: string, namespace: string, name: string, version: string): Observable<any> {
    return this.http
      .post(
        `/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims/robin
        /${name}/snapshot/${version}/namespaces/${namespace}/clusters/${cluster}`, null)
      .catch(error => Observable.throw(error));
  }

  deleteSnapshot(appId: number, cluster: string, namespace: string, name: string, version: string): Observable<any> {
    return this.http
      .delete(`/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims
      /robin/${name}/snapshot/${version}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  deleteAllSnapshot(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .delete(`/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims
      /robin/${name}/snapshot/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  rollBackSnapshot(appId: number, cluster: string, namespace: string, name: string, version: string): Observable<any> {
    return this.http
      .put(`/api/v1/kubernetes/apps/${appId}/persistentvolumeclaims
      /robin/${name}/snapshot/${version}/namespaces/${namespace}/clusters/${cluster}`, null)
      .catch(error => Observable.throw(error));
  }

}
