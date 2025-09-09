import { Injectable } from '@angular/core';
import Shirt from '../../models/shirt';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShirtService {
  constructor(private http: HttpClient) {}
  private headers: HttpHeaders = new HttpHeaders().set(
    'content-type',
    'application/json'
  );

  public add(shirt: Shirt): Observable<any> {
    return this.http.post(environment.apiUrl + '/shirt', shirt, {
      headers: this.headers,
    });
  }

  public getShirts(): Observable<any> {
    return this.http.get(environment.apiUrl + '/shirt', {
      headers: this.headers,
    });
  }

  public getShirtByIdentificator(identificator: string): Observable<any> {
    return this.http.get(environment.apiUrl + `/shirt/${identificator}`, {
      headers: this.headers,
    });
  }
}
