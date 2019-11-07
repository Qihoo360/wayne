import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Cluster } from '../../model/v1/cluster';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { TaintMetaData } from 'app/shared/model/v1/kubernetes/node-list';

@Injectable()
export class ClusterService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};
  cluster: string;

  constructor(private http: HttpClient) {
  }

  getNames(): Observable<any> {
    return this.http
      .get('/api/v1/clusters/names')
      .catch(error => throwError(error));
  }

  list(pageState: PageState, deleted?: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('deleted', deleted);
    Object.getOwnPropertyNames(pageState.params).map(key => {
      const value = pageState.params[key];
      if (isNotEmpty(value)) {
        params = params.set(key, value);
      }
    });

    const filterList: Array<string> = [];
    Object.getOwnPropertyNames(pageState.filters).map(key => {
      const value = pageState.filters[key];
      if (isNotEmpty(value)) {
        if (key === 'deleted' || key === 'id') {
          filterList.push(`${key}=${value}`);
        } else {
          filterList.push(`${key}__contains=${value}`);
        }
      }
    });
    if (filterList.length) {
      params = params.set('filter', filterList.join(','));
    }
    // sort param
    if (Object.keys(pageState.sort).length !== 0) {
      const sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }
    return this.http
      .get('/api/v1/clusters', {params: params})

      .catch(error => throwError(error));
  }

  create(cluster: Cluster): Observable<any> {
    return this.http
      .post(`/api/v1/clusters`, cluster, this.options)

      .catch(error => throwError(error));
  }

  update(cluster: Cluster): Observable<any> {
    return this.http
      .put(`/api/v1/clusters/${cluster.name}`, cluster, this.options)

      .catch(error => throwError(error));
  }

  deleteByName(name: string, logical?: boolean): Observable<any> {
    const options: any = {};
    if (logical != null) {
      let params = new HttpParams();
      params = params.set('logical', logical + '');
      options.params = params;
    }

    return this.http
      .delete(`/api/v1/clusters/${name}`, options)

      .catch(error => throwError(error));
  }

  getByName(name: string): Observable<any> {
    return this.http
      .get(`/api/v1/clusters/${name}`)

      .catch(error => throwError(error));
  }

  addLabels(name: string, cluster: string, label: Object) {
    return this.http
      .post(`/api/v1/kubernetes/nodes/${name}/clusters/${cluster}/labels`, label, this.options)
      .catch(error => throwError(error));
  }

  deleteLabels(name: string, cluster: string, label: Object) {
    return this.http.request('delete', `/api/v1/kubernetes/nodes/${name}/clusters/${cluster}/labels`, {
      body: label
    }).catch(error => throwError(error));
  }

  addTaint(name: string, cluster: string, taint: TaintMetaData) {
    return this.http
      .post(`/api/v1/kubernetes/nodes/${name}/clusters/${cluster}/taint`, taint)
      .catch(error => throwError(error));
  }

  deleteTaint(name: string, cluster: string, taint: TaintMetaData) {
    return this.http
      .request('delete', `/api/v1/kubernetes/nodes/${name}/clusters/${cluster}/taint`, {
        body: taint
      })
      .catch(error => throwError(error));
  }

}
