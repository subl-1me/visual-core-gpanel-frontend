import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShirtQrService {
  constructor(private http: HttpClient) {}

  public generateQrCode(identificator: string): Observable<any> {
    return this.http.get(environment.apiUrl + `/qr/${identificator}`, {
      responseType: 'blob',
    });
  }
}
