import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments';
import { Observable } from 'rxjs';
import Sale from '../../models/sale';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private headers: HttpHeaders = new HttpHeaders().set(
    'content-type',
    'application/json'
  );
  constructor(private http: HttpClient) {}

  public getSalesList(): Observable<any> {
    return this.http.get(environment.apiUrl + '/sale', {
      headers: this.headers,
    });
  }

  public addSale(sale: Sale): Observable<any> {
    return this.http.post(environment.apiUrl + '/sale', sale, {
      headers: this.headers,
    });
  }
}
