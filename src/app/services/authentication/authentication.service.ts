import { Injectable } from '@angular/core';
import Admin from '../../models/admin';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuth());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

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
    this.isAuthenticatedSubject.next(true);
  }

  public getLoginSession(): any {
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    if (!session || !session.id || typeof session === 'undefined') {
      return null;
    }

    return session.id ? session : null;
  }

  public updateSession(session: any): void {
    localStorage.setItem('session', JSON.stringify(session));
    this.isAuthenticatedSubject.next(true);
  }

  public logOut(): void {
    localStorage.removeItem('session');
    this.isAuthenticatedSubject.next(false);
  }
}
