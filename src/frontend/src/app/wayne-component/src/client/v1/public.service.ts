import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()

export class PublicService {

  constructor(private http: HttpClient) {
  }

  getShellToken(namespace: string, podName: string): Observable<any> {
    const headers = new HttpHeaders();
    const username = 'publicV1';
    const password = 'a1b2c3d4E';
    headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const options: any = {'headers': headers};

    const urlSearchParams = new HttpParams();
    urlSearchParams.append('namespace', namespace);
    urlSearchParams.append('podName', podName);
    return this.http
      .post(`/api/v1/public/shell/token`, urlSearchParams, options)

      .catch(error => throwError(error));
  }
}
