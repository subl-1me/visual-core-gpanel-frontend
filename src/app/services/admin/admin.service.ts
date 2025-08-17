import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import Admin from '../../models/admin';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  public getAdminById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/adm/${id}`);
  }

  public updateAdmin(admin: Admin): Observable<any> {
    return this.http.put(`${environment.apiUrl}/adm/${admin.id}`, admin);
  }
}
