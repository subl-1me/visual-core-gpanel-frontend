import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import Stock from '../../models/stock';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}
  private headers: HttpHeaders = new HttpHeaders().set(
    'content-type',
    'application/json'
  );

  public add(stock: Stock, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('stockPayload', JSON.stringify(stock));
    files.forEach((file, _index) => {
      formData.append('images', file);
    });

    return this.http.post(environment.apiUrl + '/stock', formData);
  }

  public getStocks(): Observable<any> {
    return this.http.get(environment.apiUrl + '/stock', {
      headers: this.headers,
    });
  }

  public update(
    stock: Stock,
    newFiles: File[],
    toDelete: string[],
    newCoverFromUploads?: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('stockPayload', JSON.stringify(stock));
    formData.append('newCoverFromUploads', newCoverFromUploads || '');
    formData.append('toDelete', JSON.stringify(toDelete));
    newFiles.forEach((file, _index) => {
      formData.append('images', file);
    });
    return this.http.put(
      environment.apiUrl + `/stock/${stock._id || ''}`,
      formData
    );
  }

  public delete(stockId: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('stock_id', stockId);
    return this.http.delete(environment.apiUrl + '/stock', {
      params,
      headers: this.headers,
    });
  }

  public getStock(stockId: string): Observable<any> {
    return this.http.get(environment.apiUrl + `/stock/${stockId}`, {
      headers: this.headers,
    });
  }
}
