import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor() {}

  public isAuth(): boolean {
    const authTkn = localStorage.getItem('tkn');
    return authTkn ? true : false;
  }
}
