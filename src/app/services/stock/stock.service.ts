import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import Stock from '../../models/stock';
import { Observable } from 'rxjs';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}
  private headers: HttpHeaders = new HttpHeaders().set(
    'content-type',
    'application/json'
  );

  public add(stock: Stock): Observable<any> {
    return this.http.post(environment.apiUrl + '/stock', stock, {
      headers: this.headers,
    });
  }

  public getStocks(): Observable<any> {
    return this.http.get(environment.apiUrl + '/stock', {
      headers: this.headers,
    });
  }

  public delete(stockId: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('stock_id', stockId);
    return this.http.delete(environment.apiUrl + '/stock', {
      params,
      headers: this.headers,
    });
  }
}
