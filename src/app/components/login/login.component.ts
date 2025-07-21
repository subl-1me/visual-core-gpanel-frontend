import { Component } from '@angular/core';
import Admin from '../../models/admin';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FormsModule, Form } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public isLoading: boolean = false;
  public errorLoginMessage: string = '';

  public user: Admin = {
    id: '',
    username: '',
    email: '',
  };
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  public login(form: Form): void {
    this.isLoading = true;
    this.authService.requestAuthentication(this.user).subscribe((response) => {
      const { error, authenticated, session, message } = response.authResponse;
      if (error || !authenticated) {
        this.errorLoginMessage = message;
        this.isLoading = false;
        return;
      }

      this.authService.saveLoginSession(session);
      this.isLoading = false;
      this.router.navigate(['']);
    });
  }
}
