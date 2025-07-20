import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Admin from '../../models/admin';
import { environment } from '../../../environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddAdmService {
  private http = inject(HttpClient);
  public headers = new HttpHeaders().set('content-type', 'application/json');
  constructor() {}

  public addNewAdm(adm: Admin): Observable<any> {
    return this.http.post(environment.apiUrl + '/adm', adm, {
      headers: this.headers,
    });
  }
}
