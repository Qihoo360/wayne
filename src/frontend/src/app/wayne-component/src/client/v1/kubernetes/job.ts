import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { PageState } from '../../../page/page-state';
import { BaseClient } from './base-client';

@Injectable()
export class JobClient {
  constructor(private http: HttpClient) {
  }

  listJobByCronJob(pageState: PageState, cluster: string, namespace: string, cronjobName: string, appId: number): Observable<any> {
    let params = BaseClient.buildParam(pageState);
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = 0;
    }
    params = params.set('name', cronjobName);
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/jobs/namespaces/${namespace}/clusters/${cluster}`, {params: params})
      .catch(error => throwError(error));
  }

  PodsEvent(appId: number, cluster: string, namespace: string, jobName: string, cronjobName: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/jobs/getPodsEvent/${jobName}/${cronjobName}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }
}
