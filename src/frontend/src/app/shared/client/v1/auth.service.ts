import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthoriseService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  Login(username: string, password: string, type: string): Observable<any> {
    return this.http
      .post(`/login/${type}?username=${username}&password=${password}`, null, this.options)

      .catch(error => Observable.throw(error));
  }
}
