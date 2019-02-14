import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

export const robinBaseUrl = `/api/v1/kubernetes/apps/`;

@Injectable()
export class PersistentVolumeClaimRobinClient {
  constructor(private http: HttpClient) {
  }

  getStatus(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(robinBaseUrl + `${appId}/persistentvolumeclaims/robin/${name}/status/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  activeRbdImage(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .post(robinBaseUrl + `${appId}/persistentvolumeclaims/robin/${name}/rbd/namespaces/${namespace}/clusters/${cluster}`, null)
      .catch(error => throwError(error));
  }

  inActiveRbdImage(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .delete(robinBaseUrl + `${appId}/persistentvolumeclaims/robin/${name}/rbd/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  offlineRbdImageUser(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .delete(robinBaseUrl + `${appId}/persistentvolumeclaims/robin/${name}/user/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  loginInfo(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(robinBaseUrl + `${appId}/persistentvolumeclaims/robin/${name}/user/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  verify(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(robinBaseUrl + `${appId}/persistentvolumeclaims/robin/${name}/verify/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  listSnapshot(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(robinBaseUrl + `${appId}/persistentvolumeclaims/robin/${name}/snapshot/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  createSnapshot(appId: number, cluster: string, namespace: string, name: string, version: string): Observable<any> {
    return this.http
      .post(
        robinBaseUrl +
        `${appId}/persistentvolumeclaims/robin/${name}/snapshot/${version}/namespaces/${namespace}/clusters/${cluster}`, null)
      .catch(error => throwError(error));
  }

  deleteSnapshot(appId: number, cluster: string, namespace: string, name: string, version: string): Observable<any> {
    return this.http
      .delete(robinBaseUrl +
        `${appId}/persistentvolumeclaims/robin/${name}/snapshot/${version}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  deleteAllSnapshot(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .delete(robinBaseUrl +
        `${appId}/persistentvolumeclaims/robin/${name}/snapshot/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  rollBackSnapshot(appId: number, cluster: string, namespace: string, name: string, version: string): Observable<any> {
    return this.http
      .put(robinBaseUrl +
        `${appId}/persistentvolumeclaims/robin/${name}/snapshot/${version}/namespaces/${namespace}/clusters/${cluster}`, null)
      .catch(error => throwError(error));
  }

}
