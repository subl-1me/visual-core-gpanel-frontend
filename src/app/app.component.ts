import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NgIf } from '@angular/common';
import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthenticationService) {}

  public isAuth: boolean = false;

  title = 'visual-core';

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((auth) => {
      this.isAuth = auth;
    });
  }
}
