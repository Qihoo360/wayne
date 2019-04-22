import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { PersistentVolume } from '../../../model/v1/kubernetes/persistentvolume';
import { throwError } from 'rxjs';

@Injectable()
export class PersistentVolumeRobinClient {
  constructor(private http: HttpClient) {
  }

  listRbdImages(cluster: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/persistentvolumes/robin/rbd.images/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  createRbdImage(pv: PersistentVolume, cluster: string): Observable<any> {
    return this.http
      .post(`/api/v1/kubernetes/persistentvolumes/robin/rbd.images/clusters/${cluster}`, pv)
      .catch(error => throwError(error));
  }

}
