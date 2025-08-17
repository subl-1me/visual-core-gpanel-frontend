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
    name: '',
    lastName: '',
    email: '',
  };
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  public login(form: any): void {
    this.isLoading = true;
    this.authService.requestAuthentication(this.user).subscribe({
      next: (response) => {
        const res = response.authResponse;
        if (res.error || !res.session || !res.authenticated) {
          this.errorLoginMessage = res.message;
          this.isLoading = false;
          return;
        }

        this.authService.saveLoginSession(res.session);
        this.isLoading = false;
        form.reset();
        this.router.navigate(['']);
      },
      error: (err) => {
        this.errorLoginMessage = err.error.message;
        this.isLoading = false;
      },
    });
  }
}
