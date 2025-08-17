import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import Customer from '../../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private headers: HttpHeaders = new HttpHeaders().set(
    'content-type',
    'application/json'
  );

  constructor(private http: HttpClient) {}

  public addCustomer(customer: Customer): Observable<any> {
    return this.http.post(environment.apiUrl + '/customer', customer, {
      headers: this.headers,
    });
  }

  public getCustomerList(): Observable<any> {
    return this.http.get(environment.apiUrl + '/customer', {
      headers: this.headers,
    });
  }
}
