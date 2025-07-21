import { Injectable } from '@angular/core';
import Admin from '../../models/admin';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private headers: HttpHeaders = new HttpHeaders().set(
    'content-type',
    'application/json'
  );
  constructor(private httt: HttpClient) {}

  public isAuth(): boolean {
    const session = this.getLoginSession();
    return session ? true : false;
  }

  public requestAuthentication(user: Admin): Observable<any> {
    return this.httt.post(environment.apiUrl + '/login', user, {
      headers: this.headers,
    });
  }

  public saveLoginSession(session: any): void {
    localStorage.setItem('session', JSON.stringify(session));
  }

  public getLoginSession(): any {
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    return session.id ? session : null;
  }
}
